var OU = '/Archive'
function getDomainUsersList() {
  var users = [];
  do {
    //gather users from Archive OU, have to do this for each domain
    //main company
    response_company = AdminDirectory.Users.list({
      domain: 'company.com',
      query: 'orgUnitPath=/Archive',
    });
    try{
      response_company.users.forEach(function (user) {
      users.push([user.primaryEmail,]);

    });
    } catch{}

    //domain 2
    response_domain2 = AdminDirectory.Users.list({
      domain: 'domain2',
      query: 'orgUnitPath=/Archive',
    });
    try{
      response_domain2.users.forEach(function (user) {
      users.push([user.primaryEmail,]);
    });
    } catch{}
    
    //domain 3
    response_domain3 = AdminDirectory.Users.list({
      domain: 'domain3',
      query: 'orgUnitPath=/Archive',
    });
    try{
      response_domain3.users.forEach(function (user) {
      users.push([user.primaryEmail,]);
    });
    } catch{}

    //zendesk
    response_zendesk = AdminDirectory.Users.list({
      domain: 'company.zendesk.com',
      query: 'orgUnitPath=/Archive',
    });
    try{
      response_zendesk.users.forEach(function (user) {
      users.push([user.primaryEmail,]);
    });
    } catch{}

    // page results
    if (response_company.nextPageToken) {
      options.pageToken = response_company.nextPageToken;
    }
  } while (response_company.nextPageToken);

  // Insert data in spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Users') || ss.insertSheet('Users', 1);
  sheet.getRange(1, 1, users.length, users[0].length).setValues(users);
}

//loop through emails
function removeGroupMembership(){
  var users = [];
  var sheet = SpreadsheetApp.getActive().getSheetByName("Users");
  var data = sheet.getDataRange().getValues();
  var groupMembership = [];

  //gather group members
  data.forEach(function(emailAddress){
    var user = AdminDirectory.Groups.list({userKey:emailAddress}); 
    var groupMembership = user.groups;
    
    //remove user from group if exists
    try{
      groupMembership.forEach(function(group){
        group = group.email
        AdminDirectory.Members.remove(group,emailAddress);
      });
    } catch{}
  });
}
  