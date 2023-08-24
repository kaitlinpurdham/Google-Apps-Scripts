//Created by Kaitlin Purdham Feb 2023
//Loops through every account in the /User Accounts OU and adds them to the all@company.com email distro

function getCompanyUsersList() {
  var users = [];
  var options = {
    domain: 'simpli.fi',
    customer: 'my_customer',
    fields: 'users(name/fullName,primaryEmail)',
    projection: 'basic',
    viewType: 'admin_view',
    orderBy: 'email',
    maxResults: 500,
    query: "orgUnitPath='/User Accounts'",
  };


  var companyEmail = "all@company.com"
  const companyGroup = GroupsApp.getGroupByEmail(companyEmail);

  //loop through users with company domain email alias
  do {

    var response = AdminDirectory.Users.list(options);
    response.users.forEach(function (user) {
      try {
        var user_email = "" + user.primaryEmail;
        users.push([user.name, user.primaryEmail]);

        //if the group does not contain user, add them
        if (!companyGroup.hasUser(user_email)) {
          const member = { email: user_email, role: 'MEMBER' };
          AdminDirectory.Members.insert(member, companyEmail)
          logger.log("Added " + user_email)
        }
      } catch { Utilities.sleep(1000) }
    });

    // page results
    if (response.nextPageToken) {
      options.pageToken = response.nextPageToken;
    }
  } while (response.nextPageToken);

  // Insert data in spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Users') || ss.insertSheet('Users', 1);
  sheet.getRange(1, 1, users.length, users[0].length).setValues(users);
}







