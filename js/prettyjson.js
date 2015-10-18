if (!library)
   var library = {};

library.json = {
   replacer: function(match, pIndent, pKey, pVal, pEnd) {
      var key = '<span class=json-key>';
      var val = '<span class=json-value>';
      var str = '<span class=json-string>';
      var r = pIndent || '';
      if (pKey)
         r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
      if (pVal)
         r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
      return r + (pEnd || '');
      },
   prettyPrint: function(obj) {
      var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
      return JSON.stringify(obj, null, 3)
         .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
         .replace(/</g, '&lt;').replace(/>/g, '&gt;')
         .replace(jsonLine, library.json.replacer);
      }
   };

json_file_annotation = "http://ec2-52-11-203-1.us-west-2.compute.amazonaws.com/files/example_entry.json";
json_file_taxonomy = "http://ec2-52-11-203-1.us-west-2.compute.amazonaws.com/files/example_taxonomy.json";
$( document ).ready(function() {
  $.getJSON(json_file_annotation, function(json){
    console.log(json);
    $('#sample-annotation').html(library.json.prettyPrint(json));
    $.getJSON(json_file_taxonomy, function(json){
      $('#sample-taxonomy').html(library.json.prettyPrint(json));
    });
  });
});
