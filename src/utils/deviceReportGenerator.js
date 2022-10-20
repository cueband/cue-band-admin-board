import api from '../api';

const arrayToCsv = (data) => {
  return data.map(row =>
    row
    .map(String)  // convert every value to String
    .map(v => v.replaceAll('"', '""'))  // escape double colons
    .map(v => `"${v}"`)  // quote it
    .join(',')  // comma-separated
  ).join('\r\n');  // rows starting on new lines
}

export default{
  async generateDeviceOrderReport () {
    let deviceOrderResults = await api.GetUnexportedDeviceOrders();
    if (deviceOrderResults.length == 0) return;
    const unexportedRows = [
        ["Date", "Name", "Address", "Tracking Code"],
        ...deviceOrderResults.map(e => ([
            e.get("updatedAt"),
            e.get("name"),
            e.get("address").replace(/(?:(\r\n)+|\r+|\n+)/g, ", "),
            e.get("trackingCode") || ''
        ]))
    ];
    const csvContent = arrayToCsv(unexportedRows);

    const currentDate = new Date()
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(currentDate);
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(currentDate);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(currentDate);
    const filename = `DeviceOrderReport${da}${mo}${ye}.csv`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    let reportObject = await api.SaveDeviceOrderReport({ file: blob, filename, startDate: deviceOrderResults[0].get("updatedAt"), endDate: deviceOrderResults[deviceOrderResults.length - 1].get("updatedAt")});
    await api.setDeviceOrderExported(deviceOrderResults.map(e => e.id));
    return reportObject;
  }
}