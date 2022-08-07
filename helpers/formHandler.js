// Sample Data ////////////////////////////////////////////////////////
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

	"personnel_leave": "614b72f734212a0012404ef0",
	"personnel_mc": "614b74d6502471001253e74d",
	"personnel_ma": "614b756baa176500124fb1de",
	"personnel_off": "614b75748c982c0012820262",
	"personnel_report_sick": "614b7580502471001253e99a",
	"personnel_hospital_sick_bay": "614b7589f040a20012147b52",
	"personnel_attach_out": "614b7590aa176500124fb252",
	"personnel_course_seminar_briefing": "614b75988eaf060012171124",
	"personnel_child_sick_leave": "614b75a067e69e0012766202",
	"personnel_awol": "614b75a58eaf0600121711a0",
	"personnel_civil_custody": "614b75b2f040a20012147c09",
	"personnel_close_arrest": "614b75b88eaf060012171214",
	"personnel_detention": "614b75bfaa176500124fb2ea",
	"personnel_field_exercise": "614b75c68eaf06001217129c",
	"personnel_overseas_exercise": "614b75cd92710b00126c43af",
	"personnel_others": "614b75d48c982c00128203ca",
	"personnel_tekong_exercise": "614b75daaa176500124fb3e0",
	"personnel_ops_room_duty": "614b75e192710b00126c4456",
	"personnel_duty": "614b75e8f040a20012147d1e",
	"comment": "612485ff93d3b90012303ea5",
};


const data_key_conversion = {
    "Leave":"personnel_leave",
    "Medical Leave": "personnel_mc",
    "Medical Appointment": "personnel_ma",
    "Day Off": "personnel_off",
    "Reporting Sick": "personnel_report_sick",
    "Hospitalised/Sick Bay": "personnel_hospital_sick_bay",
    "Attached Out": "personnel_attach_out",
    "Course/Seminar/Briefing": "personnel_course_seminar_briefing",
    "Child Sick Leave": "personnel_child_sick_leave",
    "AWOL": "personnel_awol",
    "Civil Custody": "personnel_civil_custody",
    "Close Arrest": "personnel_close_arrest",
    "Detention": "personnel_detention",
    "Field Exercise": "personnel_field_exercise",
    "Overseas Exercise": "personnel_overseas_exercise",
    "Others": "personnel_others",
    "Tekong Exercise": "personnel_tekong_exercise",
    "Ops Room Duty": "personnel_ops_room_duty",
    "Personnel Duty": "personnel_duty"
}

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
        
        "personnel_leave": "",
        "personnel_mc": "",
        "personnel_ma": "",
        "personnel_off": "",
        "personnel_report_sick": "",
        "personnel_hospital_sick_bay": "",
        "personnel_attach_out": "",
        "personnel_course_seminar_briefing": "",
        "personnel_child_sick_leave": "",
        "personnel_awol": "",
        "personnel_civil_custody": "",
        "personnel_close_arrest": "",
        "personnel_detention": "",
        "personnel_field_exercise": "",
        "personnel_overseas_exercise": "",
        "personnel_others": "",
        "personnel_tekong_exercise": "",
        "personnel_ops_room_duty": "",
        "personnel_duty": "",
        "comment": "",
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
    var template;

    for (let key in this.statuses) {
      template = "";

      for (let rank in this.statuses[key]) {
        template += '\n' + `${this.statuses[key][rank]} ${rank}`;
      }

      this.form_data[data_key_conversion[key]] = template.trim();
    }
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
    return `
      setTimeout(function() {
        const data = ${JSON.stringify(this.getFormData())};
        const wing = "${this.metadata.wing}";
        for (let id in data){
          document.getElementById(id).value = data[id];
        }

        //document.getElementById("radio611ca80d3d48c70012444eb7").childNodes[6*2].childNodes[1].childNodes[1].childNodes[1].click();
        let radioOptions = document.getElementById("radio611ca80d3d48c70012444eb7").childNodes;
        for (let index in radioOptions){
          try{
            let option = radioOptions[index].childNodes[1].childNodes[1].childNodes[1];
            if (option.value == wing){
              option.click();
            }
          }catch (err){
            console.log(err);
          }
        }
        window.alert('Filled Up'); 
      }, 2000);
    `;
  }

  process(){
    this.collateData();
    return this.getScript();
  }
}

export { ProcessingData };