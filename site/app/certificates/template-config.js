// Redbridge certificate template registry.
// IMPORTANT: These paths must point to the exact approved uploaded certificate PNGs.
// Do not replace the approved backgrounds with CSS recreations.

window.REDBRIDGE_CERTIFICATE_TEMPLATES = {
  IELTS: {
    file: "/app/certificates/templates/ielts-template.png",
    typeCode: "IELTS",
    label: "IELTS Practice Assessment",
    fields: ["studentName","listening","reading","writing","speaking","overallBand","dateIssued","referenceNo","qr"]
  },
  SCIENCE: {
    file: "/app/certificates/templates/science-template.png",
    typeCode: "SCI",
    label: "Science Assessment",
    fields: ["studentName","assessmentLevel","score","dateIssued","referenceNo","qr"]
  },
  OLYMPIAD: {
    file: "/app/certificates/templates/olympiad-template.png",
    typeCode: "OLY",
    label: "Academic Olympiad Award",
    fields: ["studentName","competitionLevel","award","dateIssued","referenceNo","qr"]
  },
  ENGLISH: {
    file: "/app/certificates/templates/english-template.png",
    typeCode: "ENG",
    label: "English Language Assessment",
    fields: ["studentName","assessmentLevel","score","dateIssued","referenceNo","qr"]
  },
  MATH: {
    file: "/app/certificates/templates/math-template.png",
    typeCode: "MTH",
    label: "Mathematics Assessment",
    fields: ["studentName","assessmentLevel","score","dateIssued","referenceNo","qr"]
  }
};
