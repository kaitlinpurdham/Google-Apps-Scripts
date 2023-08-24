//Created by Kaitlin Purdham Feb 2023
//Loops through every account in the /User Accounts OU AND accounts that have a @acme.com email domainl adds them to the all-acme@company.com email distro

function getDomainUsersList() {
  var users = [];
  var options = {
    domain: 'acme.com',
    customer: 'my_customer',
    fields: 'users(name/fullName,primaryEmail,aliases, nonEditableAliases )',
    projection: 'full',
    viewType: 'admin_view',
    orderBy: 'email',
    maxResults: 500,
    query: "orgUnitPath='/User Accounts'",

  };


  var acmeEmail = "all-acme@simpli.fi"
  const acmeGroup = GroupsApp.getGroupByEmail(acmeEmail);

  //loop through users with acme domain email alias
  do {

    var response = AdminDirectory.Users.list(options);
    response.users.forEach(function (user) {
      try {
        var acme_domain = 'acme.com';
        var user_alias = "" + user.aliases;
        var user_email = "" + user.primaryEmail;

        if ((user.primaryEmail).includes("acme.com")) {
          users.push([user.name, user.primaryEmail]);

          //if the group does not contain user, add them
          if (!acmeGroup.hasUser(user_email)) {
            const member = { email: user_email, role: 'MEMBER' };
            AdminDirectory.Members.insert(member, acmeEmail)
            logger.log("Added " + user_email)
          }
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







}







