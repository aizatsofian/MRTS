/**
 * Formats an ISO date string into a localized date format (dd Month YYYY).
 * @param {string} iso - The ISO date string to format.
 * @returns {string} The formatted date or "-".
 */
function formatTarikh(iso) {
  if (!iso) return "-";
  const date = new Date(iso);
  return date.toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

/**
 * Fetches and displays medical report data based on user input.
 */
function searchData() {
  const input = document.getElementById("searchInput").value.trim();
  const resultArea = document.getElementById("resultArea");
  resultArea.innerHTML = "";

  // Updated alert message for specific input
  if (!input) {
    alert("Sila masukkan No. I/C Pemohon");
    return;
  }

  resultArea.innerHTML = "Mencari data...";

  // Fetch data from the Google Apps Script endpoint
  fetch(`https://script.google.com/macros/s/AKfycbzXBZ7wVDvFLD-7lejN-M0ivGWDtnRMCLbUX3T5p4Xnn9-2yLr6WARUo4J7AUv6C-cf/exec?query=${encodeURIComponent(input)}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        let html = "";
        data.forEach(entry => {
          // Determine the status based on the completion date
          const status = entry['TARIKH SIAP PERMOHONAN'] ? 'SIAP' : 'BELUM';

          // Define the structure for the table rows to match the new design
          const rows = [
            { label: 'NAMA PEMOHON', value: entry['NAMA PEMOHON'] || '-' },
            { label: 'NO. I/C PEMOHON', value: entry['I/C PEMOHON'] || '-' },
            { label: 'NO. LAPORAN', value: entry['NO LP'] || '-' },
            { label: 'NAMA PESAKIT', value: entry['NAMA PESAKIT'] || '-' },
            { label: 'NO. I/C PESAKIT', value: entry['I/C PESAKIT'] || '-' },
            { label: 'DOKTOR', value: entry['PAKAR/MO'] || '-' },
            { label: 'TARIKH MOHON LAPORAN', value: formatTarikh(entry['TARIKH ADMIT']) },
            { label: 'TARIKH SIAP LAPORAN', value: formatTarikh(entry['TARIKH SIAP PERMOHONAN']) },
            { label: 'JUMLAH HARI', value: entry['JUMLAH HARI SIAP'] || '-' },
            { label: 'STATUS', value: status },
          ];

          // Build the table HTML for the result
          html += '<table>';
          rows.forEach(row => {
            html += `
              <tr>
                <td>${row.label}</td>
                <td>${row.value}</td>
              </tr>
            `;
          });
          html += '</table>';
        });
        resultArea.innerHTML = html;
      } else {
        resultArea.innerHTML = "Tiada rekod dijumpai.";
      }
    })
    .catch(err => {
      console.error("Fetch Error:", err);
      resultArea.innerHTML = "Ralat semasa mengakses data. Sila cuba lagi kemudian.";
    });
}