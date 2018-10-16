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

function displayMedication(medCodings) {
  med_list.innerHTML += "<li> " + getMedicationName(medCodings) + "</li>";
}

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
  results.data.entry.forEach(function (prescription) {
    if (prescription.medicationCodeableConcept) {
      displayMedication(prescription.medicationCodeableConcept.coding);
    } else if (prescription.medicationReference) {
      var med = refs(prescription, prescription.medicationReference);
      displayMedication(med && med.code.coding || []);
    }
    console.log(prescription.resource.code.text);

  });
});

function searchMed() {

  var mName = document.getElementById("pName").value;

  smart.patient.api.search({ type: "Condition" }).then(function (results, refs) {
    results.data.entry.forEach(function (prescription) {
      if (prescription.medicationCodeableConcept) {
        displayMedication(prescription.medicationCodeableConcept.coding);
      } else if (prescription.medicationReference) {
        var med = refs(prescription, prescription.medicationReference);
        displayMedication(med && med.code.coding || []);
      }
      if (prescription.resource.code.text.includes(mName))
        console.log(prescription.resource.code.text);
    });
  });
}


// Search for all statins prescribed today
// var statinRxs = smart.api.search({ type: 'MedicationOrder', query: { dateWritten: '2014-05-01', name: 'statin' } }).then(function (res) {
//   console.log(" res is ", res);
// });

// smart.patient.api.search({ type: 'MedicationOrder' }).then(res => {
//   console.log(res);
// })


// search on name
// function searchPatient() {

//   var pName = document.getElementById('pName').value;
//   smart.patient.read().then(function (pt) {

//     debugger;
//     var pGroup = getPatientName();

//     displayPatient(pt);
//   });
// }