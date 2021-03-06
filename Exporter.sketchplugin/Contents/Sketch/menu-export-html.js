@import "lib/utils.js"
@import "exporter.js"
@import("constants.js")


var onRun = function(context) {  
  const Dom = require('sketch/dom')
  const doc = context.document
  const Doc = Dom.fromNative(doc)
  const Settings = require('sketch/settings') 
  var UI = require('sketch/ui')
  
  // check is something to export
  if (doc.currentPage().artboards().count() === 0) {
    UI.alert("There are no artboards to export.");
    return;
  }

  // ask for output path
  let currentPath = Settings.documentSettingForKey(doc,SettingKeys.DOC_EXPORTING_URL)
  const newPath = Utils.askSavePath(currentPath)
  if (newPath == null) {
    return
  }
  Settings.setDocumentSettingForKey(doc,SettingKeys.DOC_EXPORTING_URL,newPath) 

  // export HTML
  const exporter = new Exporter(newPath, doc, doc.currentPage(), context);
  exporter.exportArtboards();


  // open HTML in browser
  const dontOpenBrowser = Settings.settingForKey(SettingKeys.PLUGIN_DONT_OPEN_BROWSER)==1
  if(!dontOpenBrowser){
    const openPath = newPath+"/"+doc.cloudName()+"/"  
    const openResult = Utils.runCommand('/usr/bin/open', [openPath,openPath+'/index.html'])
    
    if(openResult.result){
    }else{
      UI.alert('Can not open HTML in browser', openResult.output)
    }
  }

};

