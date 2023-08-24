//Created by Kaitlin Purdham Feb 2023
//Loops through every account in the /User Accounts OU AND accounts that have a @acme.com ALIAS, adds them to the all-acme@company.com email distro

function getDomainUsersList() {
    var users = [];
    var options = {
      domain: 'xyz.com.fi',
      customer: 'my_customer',
      fields: 'users(name/fullName,primaryEmail,aliases, nonEditableAliases )',
      projection: 'full',
      viewType: 'admin_view',
      orderBy: 'email',
      maxResults: 500,
      query: "orgUnitPath='/User Accounts'",
    };
  
  
    var xyzEmail = "all-xyz@company.com"
    const xyzGroup = GroupsApp.getGroupByEmail(xyzEmail);
  
    //loop through users with xyz domain email alias
    do {
      //find users with xyz alias
      var response = AdminDirectory.Users.list(options);
      response.users.forEach(function (user) {
        try {
          var xyz_domain = 'xyz.com';
          var user_alias = "" + user.aliases;
          if (user_alias.includes("xyz.com")) {
            users.push([user.name, user.primaryEmail, user.aliases]);
  
            //if the all-xyz group does not contain user, add them
            if (!xyzGroup.hasUser(user.primaryEmail)) {
              const member = { email: user.primaryEmail, role: 'MEMBER' };
              AdminDirectory.Members.insert(member, xyzEmail)
              logger.log("Added " + user.primaryEmail)
            }
  
          }
        } catch { Utilities.sleep(1000) }
      });
      //loop through users with xyz domain email non editable alias
      response.users.forEach(function (user) {
        try {
          var xyz_domain = 'xyz.com';
          var user_alias1 = "" + user.nonEditableAliases;
          if (user_alias1.includes("xyz.com")) {
            users.push([user.name, user.primaryEmail, user.nonEditableAliases]);
  
            //if the all-xyz group does not contain user, add them
            if (!xyzGroup.hasUser(user.primaryEmail)) {
              const member = { email: user.primaryEmail, role: 'MEMBER' };
              AdminDirectory.Members.insert(member, xyzEmail)
              logger.log("Added " + user.primaryEmail)
  
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
  
  
  
  
  
  
  