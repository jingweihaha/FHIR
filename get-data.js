// function getPatientName(pt) {
//   if (pt.name) {
//     var names = pt.name.map(function (name) {
//       return name.given.join(" ") + " " + name.family.join(" ");
//     });
//     return names.join(" / ")
//   } else {
//     return "anonymous";
//   }
// }

function getMedicationName(medCodings) {
  var coding = medCodings.find(function (c) {
    return c.system == "http://www.nlm.nih.gov/research/umls/rxnorm";
  });

  debugger;

  console.log(coding);

  return coding && coding.display || "Unnamed Medication(TM)"
}

// function displayPatient(pt) {
//   var tmp = getPatientName(pt);
//   debugger;
//   document.getElementById('patient_name').innerHTML = getPatientName(pt);
// }

var med_list = document.getElementById('med_list');

// function displayMedication(medCodings) {
//   med_list.innerHTML += "<li> " + getMedicationName(medCodings) + "</li>";
// }

// Create a FHIR client (server URL, patient id in `demo`)
var smart = FHIR.client(demo),
  pt = smart.patient;

// Create a patient banner by fetching + rendering demographics
// smart.patient.read().then(function (pt) {

//   console.log("pt", pt);

//   debugger;
//   displayPatient(pt);
// });

// A more advanced query: search for active Prescriptions, including med details
// smart.patient.api.fetchAllWithReferences({type: "MedicationOrder"},
// ["MedicationOrder.medicationReference"]).then(function(results, refs) {
//    results.forEach(function(prescription){
//         if (prescription.medicationCodeableConcept) {
//             displayMedication(prescription.medicationCodeableConcept.coding);
//         } else if (prescription.medicationReference) {
//             var med = refs(prescription, prescription.medicationReference);
//             displayMedication(med && med.code.coding || []);
//         }
//    });
// });

// A more advanced query: search for active Prescriptions, including med details
smart.patient.api.search({ type: "Condition" }).then(function (results, refs) {
  var allMedication = document.getElementById('all');
  var name_all = [];
  results.data.entry.forEach(function (prescription) {
    if (prescription.medicationCodeableConcept) {
      //displayMedication(prescription.medicationCodeableConcept.coding);
    } else if (prescription.medicationReference) {
      //var med = refs(prescription, prescription.medicationReference);
      //displayMedication(med && med.code.coding || []);
    }

    console.log(prescription.resource.code.text);
    name_all.push(prescription.resource.code.text);



    //allMedication.innerHTML += prescription.resource.code.text + ','
  });

  name_all.forEach((i) => {
    var newDiv = document.createElement('div')
    newDiv.innerHTML = i;
    allMedication.appendChild(newDiv);
  })
});

function searchMed() {

  console.log("this is searchMed function");

  var mName = document.getElementById("mName").value;
  var name_arr = [];
  smart.patient.api.search({ type: "Condition" }).then(function (results, refs) {
    // var med_list = document.getElementById("med_list");
    // med_list.innerHTML = '';

    var med_list = document.getElementById("med_list");
    while (med_list.firstChild) {
      med_list.removeChild(med_list.firstChild);
    }


    results.data.entry.forEach(function (prescription) {
      if (prescription.medicationCodeableConcept) {
        displayMedication(prescription.medicationCodeableConcept.coding);
      } else if (prescription.medicationReference) {
        var med = refs(prescription, prescription.medicationReference);
        displayMedication(med && med.code.coding || []);
      }

      if (prescription.resource.code.text.toLowerCase().includes(mName.toLowerCase())) {
        console.log(prescription.resource.code.text);
        name_arr.push(prescription.resource.code.text);
      }
    });

    name_arr.forEach((i) => {
      var newDiv = document.createElement('div')
      newDiv.innerHTML = i;
      med_list.appendChild(newDiv);
    })

  });
}
