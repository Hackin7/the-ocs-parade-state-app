// Sample Data ////////////////////////////////////////////////////////
const status_ids = {
  "Duty": "614b75e8f040a20012147d1e", 
  "Day Off": "614b75748c982c0012820262",
  "Leave(Local/Overseas)": "614b72f734212a0012404ef0",
  "Reporting Sick": "614b7580502471001253e99a",
  "Medical Leave": "614b74d6502471001253e74d",
  "Medical/Dental Appointment": "614b756baa176500124fb1de",
  "Hospitalised/Sick Bay": "614b7589f040a20012147b52",
  "Child Sick Leave": "614b75a067e69e0012766202",
  "Course/Seminar/Briefing": "614b75988eaf060012171124",
  "Field Exercise": "614b75c68eaf06001217129c",
  "Overseas Exercise": "614b75cd92710b00126c43af",
  "AWOL": "614b75a58eaf0600121711a0",
  "Close Arrest": "614b75b88eaf060012171214",
  "Detention": "614b75bfaa176500124fb2ea",
  "Civil Custody": "614b75b2f040a20012147c09",
  "Attached Out": "614b7590aa176500124fb252",
  "Others": "614b75d48c982c00128203ca",
};
const web_form_id = {
	"name_rank": '612484e7969acc0012a0615f', 
	"og_permstaff_total": "612486e193d3b90012305a04-7",
	"og_permstaff_reg": "612486e193d3b90012305a06-8",
	"og_permstaff_nsf": "612486e193d3b90012305a08-9",
	"og_cadet_total": "6124880c8075e90012ababa6-10",
	"og_cadet_reg": "6124880c8075e90012ababa8-11",
	"og_cadet_nsf": "6124880c8075e90012ababaa-12",
	"og_cadet_io": "612488c793d3b9001230925b-13",
	
	"curr_permstaff_total": "61248796e7eaf10012a54f37-7",
	"curr_permstaff_reg": "61248796e7eaf10012a54f39-8",
	"curr_permstaff_nsf": "61248796e7eaf10012a54f3b-9",
	"curr_cadet_total": "61248796e7eaf10012a54f3d-10",
	"curr_cadet_reg": "61248879c6ae9a00125d8257-11",
	"curr_cadet_nsf": "61248879c6ae9a00125d8259-12",
	"curr_cadet_io": "61248879c6ae9a00125d825b-13",

  ...status_ids,
	"Comment": "612485ff93d3b90012303ea5",
};

function form_data_starter(){
    return {
        "name_rank": '', 
        "og_permstaff_total": 0,
        "og_permstaff_reg": 0,
        "og_permstaff_nsf": 0,
        "og_cadet_total": 0,
        "og_cadet_reg": 0,
        "og_cadet_nsf": 0,
        "og_cadet_io": 0,
        
        "curr_permstaff_total": 0,
        "curr_permstaff_reg": 0,
        "curr_permstaff_nsf": 0,
        "curr_cadet_total": 0,
        "curr_cadet_reg": 0,
        "curr_cadet_nsf": 0,
        "curr_cadet_io": 0,
        
        "Comment": "",
    }
}

// Data Processing //////////////////////////////////////////////////////////

class ProcessingData {
  constructor(staff, metadata) {
    // Given Data
    this.staff = staff;
    this.metadata = metadata;
    console.log("### Data Input");
    console.log(this.metadata);
    console.log(this.staff);
    // Processing Data
    this.statuses = {};
    this.form_data = form_data_starter();
  }

  // Helpers to Process Data ////////////////////////////////////////
  permstaffHelper(person) {
    let {rank, name, personType, service, isPresent, status} = person;

    if (personType !== "Permstaff") {
      return;
    }

    this.form_data["og_permstaff_total"] += 1;
    this.form_data["og_permstaff_reg"] += service === "Regular" ? 1 : 0;
    this.form_data["og_permstaff_nsf"] += service === "NSF" ? 1 : 0;

    if (!isPresent) {
      return;
    }

    this.form_data["curr_permstaff_total"] += 1;
    this.form_data["curr_permstaff_reg"] += service === "Regular" ? 1 : 0;
    this.form_data["curr_permstaff_nsf"] += service === "NSF" ? 1 : 0;
  }

  statusHelper(person) {
    let {rank, name, status} = person;
    var key;

    if (status) {
      //console.log(name, status);
      key = status;

      if (this.statuses[key] === undefined) {
        this.statuses[key] = {};
      }

      if (this.statuses[key][rank] === undefined) {
        this.statuses[key][rank] = 0;
      }

      this.statuses[key][rank] += 1;
    }
  }
  
  // Add more Status Manually //////////////////////////////////////////////
  status_simplified(rank, status) {
    var key;
    if (status) {
      console.log(rank, status);
      key = status;
      console.log("done");
      if (this.statuses[key] === undefined) {
        this.statuses[key] = {};
      }
      if (this.statuses[key][rank] === undefined) {
        this.statuses[key][rank] = 0;
      }
      this.statuses[key][rank] += 1;
    }
  }

  // Unpacking to Form Inputs //////////////////////////////////////////////////
  status_unpacking() {
    for (let key in status_ids) {
      if (!key) continue;
      
      let template = "";
      for (let rank in this.statuses[key]) {
        template += '\n' + `${this.statuses[key][rank]} ${rank}`;
      }
      if (template === ""){ template = "0"; }
      
      this.form_data[key] = template.trim();
    }
    console.log(this.form_data);
  }

  collateData() {
    this.statuses = {};
    this.form_data = form_data_starter();
    
    let cadetNSF = Number.parseInt(this.metadata.cadetsNSF);
    let cadetReg = Number.parseInt(this.metadata.cadetsReg);
    let cadetIO = Number.parseInt(this.metadata.cadetsIO);
    let mc = Number.parseInt(this.metadata.mcCadets);

    for (let staffKey in this.staff){
      //console.log(this.staff[staffKey]);
      this.permstaffHelper(this.staff[staffKey]);
      this.statusHelper(this.staff[staffKey]);
    }

    this.form_data["name_rank"] = this.metadata.name;
    this.form_data["og_cadet_total"] = cadetNSF + cadetReg + cadetIO;
    this.form_data["og_cadet_reg"] = cadetReg;
    this.form_data["og_cadet_nsf"] = cadetNSF;
    this.form_data["og_cadet_io"] = cadetIO;
    this.form_data["curr_cadet_total"] = cadetNSF + cadetReg + cadetIO - mc;
    this.form_data["curr_cadet_reg"] = cadetReg;
    this.form_data["curr_cadet_nsf"] = cadetNSF - mc;
    this.form_data["curr_cadet_io"] = cadetIO;

    for (var i = 0, _pj_a = mc; i < _pj_a; i += 1) {
      this.status_simplified("OCT", "Medical Leave");
    }
    this.status_unpacking();
    
    this.form_data["Comment"] = "NIL";
  }

  // Data to Web Form Element ///////////////////////////////////
  getFormData(){
    let data = this.form_data;
    let output = {};
    for (let key in data){
      let elementId = web_form_id[key];
      output[elementId] = data[key];
    }
    return output;
  }

  getScript(){
    // https://stackoverflow.com/questions/53628112/fill-angular-input-using-javascript
    return `
      function run() {
        const event = new Event('input', { bubbles: true }); 
        const data = ${JSON.stringify(this.getFormData())};
        const wing = "${this.metadata.wing}";
        for (let id in data){
          if (id == "undefined"){ continue; }
          try{
            let element = document.getElementById(id);
            element.value = data[id] !== "" ? data[id] : null; // Set as null to cause an error message
            element.dispatchEvent(event);
          } catch (err) {
            alert("Text Filling Error: "+err + ", " + id + ", " + document.getElementById(id));
          }
        }

        //document.getElementById("radio611ca80d3d48c70012444eb7").childNodes[6*2].childNodes[1].childNodes[1].childNodes[1].click();
        let radioOptions = document.getElementById("radio611ca80d3d48c70012444eb7").childNodes;
        for (let index in radioOptions){
          try{
            let option = radioOptions[index].childNodes[1].childNodes[1].childNodes[1];
            if (option.value == wing && !option.checked){
              option.click();
              window.alert('Filled Up'); 
            }
          }catch (err){
            console.log("Wing Selection Error: "+err);
          }
        }
      }
      setTimeout(function(){
        try {run();}
        catch (err) {alert("App Error: "+err);}
      }, 2000);
    `;
  }

  process(){
    this.collateData();
    return this.getScript();
  }
}

export { ProcessingData };
