// app/compare/page.tsx
export default function ComparePage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Compare All Filings</h1>
        <p className="text-slate-600">California Auto Insurance</p>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-10 rounded-2xl border border-slate-200 mb-12">
        <h3 className="text-xl font-bold text-slate-900 mb-6">
          Rate Changes by Company (Last 6 Months)
        </h3>
        <div className="h-96 bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl flex items-center justify-center text-blue-500 font-semibold border-2 border-dashed border-blue-300">
          Interactive Bar Chart - Companies Ranked by Rate Increase
          <br />
          (Use Recharts or Chart.js here)
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-10 rounded-2xl border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6">All Filings</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-4 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                  Company
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                  Rate Change
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                  Filed
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                  Effective
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-4 font-semibold">ABC Insurance</td>
                <td className="py-4 px-4 text-red-600 font-bold">+12.5%</td>
                <td className="py-4 px-4">Jan 8, 2025</td>
                <td className="py-4 px-4">
                  <span className="bg-yellow-100 text-yellow-900 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase">
                    Pending
                  </span>
                </td>
                <td className="py-4 px-4">Apr 1, 2025</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-4 font-semibold">XYZ Insurance</td>
                <td className="py-4 px-4 text-orange-600 font-bold">+7.8%</td>
                <td className="py-4 px-4">Jan 7, 2025</td>
                <td className="py-4 px-4">
                  <span className="bg-green-100 text-green-900 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase">
                    Approved
                  </span>
                </td>
                <td className="py-4 px-4">Mar 15, 2025</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-4 font-semibold">Premier Insurance</td>
                <td className="py-4 px-4 text-green-600 font-bold">-2.1%</td>
                <td className="py-4 px-4">Jan 6, 2025</td>
                <td className="py-4 px-4">
                  <span className="bg-green-100 text-green-900 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase">
                    Approved
                  </span>
                </td>
                <td className="py-4 px-4">Feb 28, 2025</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-4 font-semibold">National Insurance</td>
                <td className="py-4 px-4 text-orange-600 font-bold">+5.2%</td>
                <td className="py-4 px-4">Jan 5, 2025</td>
                <td className="py-4 px-4">
                  <span className="bg-green-100 text-green-900 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase">
                    Approved
                  </span>
                </td>
                <td className="py-4 px-4">Mar 1, 2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
