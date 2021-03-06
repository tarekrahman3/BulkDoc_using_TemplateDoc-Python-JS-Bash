/**
 * Scripting by Tarek R.
 * Date: 04-22-2021
 * Last Updated: 04-25-2021
 * List of functions with parameters:
    * onOpen(e)
    * main()
    * prepareResources()
    note: template document id and google drive folder id goes into this function
    * getInputData()
    * docCreate()
    * makeChanges(body, address_1stLine, address_2ndLine)
**/

// load user interface for custom menu and script initiation
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createMenu('Custom Automation')
      .addItem('Automate Document Creation', 'main')
      .addToUi();
}

// defininig template file & export folder path 
function prepareResources(time){
  // template document id string
  templateID = '!! TEMPLATE DOCUMENT ID GOES HERE !!';
  // dynamic folder name for each run
  FOLDER_NAME = "!! Doc Exports " + time;
  // create new folder under an already created blank folder
  newFolder = DriveApp.getFolderById('!! A NEW BLANK FOLDER ID GOES HERE !!').createFolder(FOLDER_NAME);
  // new folder location url for final alert
  newFolderLink = 'Folder Liink: \n' + 'https://drive.google.com/drive/folders/' + (newFolder.getId())  + '/';
  folder = DriveApp.getFolderById(newFolder.getId());
  return prepareResources;
}

// building main function
function main() {
  // current time variable
  time = Utilities.formatDate(new Date(),"GMT"+6, "yyyy-MM-dd'T'HH:mm:ss'Z'");
  // gather resources
  prepareResources(time);
  // create documents
  array = docCreate();
  // insert new documents link to the spreadsheet
   SpreadsheetApp.getActiveSheet()
    .getRange(2,4,array.length,2)
    .setValues(array);
   // show folder location
   SpreadsheetApp.getUi().alert(newFolderLink);
}

// getting addresses from spreadsheet
function getInputData() {
  dictList = [];
  var sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Address List');
  range = sheet.getRange(2,2,(sheet.getLastRow())-1,2).getValues();
  // creating and storing data dictionary into a list
  for(var i=0; i<range.length;i++){
   dictList.push(data = {
     'a':range[i][0],
     'b':range[i][1]
     });
  }
  return dictList;
}

// change the values of newly created document by one using the inputData() dictionary
function docCreate(){
  // calling 'getInputData' function; returns the list of dictionary containing input texts for each document
  addressDictionary = getInputData();
  addressDictionaryLength = addressDictionary.length;
  // declaring an empty array
  new_docs_url_list = [];
  // looping for creating each doc file
  for (var n = 0; n < addressDictionary.length; n++) {
    // copy template 
    var newDoc =  DriveApp
      .getFileById(templateID)
      .makeCopy((addressDictionary[n].a), folder);
    newDocId =  newDoc.getId();
    body = DocumentApp
      .openById(newDocId).getBody();
    console.log(n+1 + ' out of ' + addressDictionaryLength + ' - ' + String(addressDictionary[n].a))
    // calling 'makeChanges' function, replacing each text
    // dictionary indexing used;
    // n is for indexing the dictionary itself; the dictionary is inside 'dictList' list
    makeChanges(
      body,
      address_1stLine=(addressDictionary[n].a),
      address_2ndLine=(addressDictionary[n].b));
    // creating strings for newly modifiied document location url & export as pdf url
    newDocId = newDoc.getId();
    new_docs_url_list.push(
      ['https://docs.google.com/document/d/' + newDocId,
      'https://docs.google.com/document/d/' + newDocId + '/export?format=pdf']);
  }
  console.log(new_docs_url_list)
  return new_docs_url_list;
}

// find and replace AddressLine1
function makeChanges(body, address_1stLine, address_2ndLine){
  replaceItem1 = body.findText('AddressLine1').getElement()
    .editAsText().replaceText('AddressLine1', address_1stLine);
  replaceItem2 = body.findText('AddressLine2').getElement()
    .editAsText().replaceText('AddressLine2', address_2ndLine);
  return makeChanges;
}
