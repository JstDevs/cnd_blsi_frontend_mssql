import { useState } from "react";
import { Printer, Search, Plus, Edit, Trash2 } from "lucide-react";

function ChequeGeneratorPage() {
  const [chequeData, setChequeData] = useState({
    payee: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    bank: "",
    accountNumber: "",
    particulars: "",
    checkNumber: "",
    brstn: "",
    dv: "",
  });

  const [chequeTemplate, setChequeTemplate] = useState({
    type: "Double", // Single or Double
    bank: "BDO-MSL - BDO Makati",
    dv: "10420252213355100",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSignatory1, setSelectedSignatory1] = useState("");
  const [selectedSignatory2, setSelectedSignatory2] = useState("");

  const banks = [
    { value: "LBP", label: "Land Bank of the Philippines" },
    { value: "DBP", label: "Development Bank of the Philippines" },
    { value: "PNB", label: "Philippine National Bank" },
    { value: "BDO", label: "BDO-MSL - BDO Makati" },
  ];

  const accounts = [
    {
      value: "1234567890",
      label: "General Fund - Current Account",
      name: "YES",
    },
    {
      value: "0987654321",
      label: "Special Education Fund - Current Account",
      name: "YES",
    },
    { value: "1357924680", label: "Trust Fund - Current Account", name: "YES" },
    { value: "1231312123", label: "YES" },
  ];

  const signatories = [
    { id: 1, name: "Leah, Bugarin, Marquez - 00000" },
    { id: 2, name: "MElvin, Alvarez - 00001" },
    { id: 3, name: "John, Doe - 00002" },
  ];

  // Sample check list data
  const [checkList, setCheckList] = useState([
    {
      id: 1,
      status: "Cheq...",
      linkId: "1112...",
      disbursementId: "8",
      bankType: "",
      signalType: "123",
      accountNumber: "Pedro",
      accountName: "456",
      checkNumber: "789",
      brstn: "1...",
      chP: "J.S.f.",
      pA: "1",
      vS: "6",
      sR: "1",
      aFP: "1",
    },
    {
      id: 3,
      status: "Posted",
      linkId: "1102...",
      disbursementId: "1042025...",
      bankType: "2",
      signalType: "Dou...",
      accountNumber: "1231...",
      accountName: "YES",
      checkNumber: "0000...",
      brstn: "112",
      chP: "1...",
      pA: "M.I.E.",
      vS: "6",
      sR: "1",
      aFP: "1",
    },
    {
      id: 4,
      status: "Posted",
      linkId: "1212...",
      disbursementId: "2",
      bankType: "Sin...",
      signalType: "3860...",
      accountNumber: "BLS IN...",
      accountName: "0002...",
      checkNumber: "010...",
      brstn: "2...",
      chP: "M.5.F.",
      pA: "1",
      vS: "2",
      sR: "",
      aFP: "",
    },
    {
      id: 5,
      status: "Posted",
      linkId: "1242...",
      disbursementId: "2",
      bankType: "Dou...",
      signalType: "3860...",
      accountNumber: "BLS IN...",
      accountName: "0002...",
      checkNumber: "010...",
      brstn: "2...",
      chP: "D.T.T.",
      pA: "1",
      vS: "2",
      sR: "",
      aFP: "",
    },
    {
      id: 6,
      status: "Posted",
      linkId: "2252...",
      disbursementId: "2252025...",
      bankType: "6",
      signalType: "Dou...",
      accountNumber: "3971...",
      accountName: "TESTI...",
      checkNumber: "0000...",
      brstn: "201",
      chP: "1...",
      pA: "C.9.N.",
      vS: "1",
      sR: "1",
      aFP: "2",
    },
    {
      id: 7,
      status: "Posted",
      linkId: "2252...",
      disbursementId: "2252025...",
      bankType: "8",
      signalType: "Dou...",
      accountNumber: "1005...",
      accountName: "test",
      checkNumber: "2132...",
      brstn: "1231",
      chP: "2...",
      pA: "C.1.N.",
      vS: "4",
      sR: "1",
      aFP: "2",
    },
    {
      id: 8,
      status: "Posted",
      linkId: "2262...",
      disbursementId: "2262025...",
      bankType: "5",
      signalType: "Dou...",
      accountNumber: "1202...",
      accountName: "PNB",
      checkNumber: "1221...",
      brstn: "121",
      chP: "2...",
      pA: "C.7.S.",
      vS: "1",
      sR: "1",
      aFP: "2",
    },
    {
      id: 9,
      status: "Posted",
      linkId: "2262...",
      disbursementId: "2262025...",
      bankType: "6",
      signalType: "Dou...",
      accountNumber: "3123...",
      accountName: "wewe",
      checkNumber: "2312...",
      brstn: "121",
      chP: "1...",
      pA: "C.6.S.",
      vS: "2",
      sR: "3",
      aFP: "2",
    },
    {
      id: 10,
      status: "Posted",
      linkId: "3042...",
      disbursementId: "3042025...",
      bankType: "6",
      signalType: "Dou...",
      accountNumber: "2132...",
      accountName: "cedric",
      checkNumber: "1231...",
      brstn: "213",
      chP: "0...",
      pA: "C.9.N.",
      vS: "6",
      sR: "1",
      aFP: "2",
    },
    {
      id: 11,
      status: "Posted",
      linkId: "3052...",
      disbursementId: "3052025...",
      bankType: "5",
      signalType: "Dou...",
      accountNumber: "2131...",
      accountName: "test",
      checkNumber: "2132...",
      brstn: "1332",
      chP: "0...",
      pA: "C.1.O.",
      vS: "1",
      sR: "1",
      aFP: "2",
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChequeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTemplateChange = (field, value) => {
    setChequeTemplate((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle cheque generation
    alert("Cheque generated successfully!");
  };

  const handlePrint = () => {
    window.print();
  };

  // Format amount to words
  const amountToWords = (amount) => {
    if (!amount) return "Enter Amount";
    const formatter = new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    });
    return formatter.format(amount) + " ONLY";
  };

  const filteredCheckList = checkList.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cheque Generator</h1>
          <p className="text-gray-600">Generate and print cheques</p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-700 transition"
        >
          <Printer className="h-5 w-5 mr-2" />
          Print Cheque
        </button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 my-4">
        {/* Cheque Template Section */}
        <div className="bg-white p-4 rounded-lg shadow border flex-1">
          <h2 className="text-lg font-semibold mb-4 text-yellow-700">
            Cheque Template
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bank:</label>
              <p className="text-sm bg-gray-50 p-2 rounded">
                {chequeTemplate.bank}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="chequeType"
                    value="Single"
                    checked={chequeTemplate.type === "Single"}
                    onChange={(e) =>
                      handleTemplateChange("type", e.target.value)
                    }
                    className="mr-2"
                  />
                  Single
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="chequeType"
                    value="Double"
                    checked={chequeTemplate.type === "Double"}
                    onChange={(e) =>
                      handleTemplateChange("type", e.target.value)
                    }
                    className="mr-2"
                  />
                  Double
                </label>
              </div>
            </div>

            <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300">
              Choose Bank
            </button>

            <div>
              <label className="block text-sm font-medium mb-1">DV:</label>
              <input
                type="text"
                value={chequeTemplate.dv}
                onChange={(e) => handleTemplateChange("dv", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Cheque Details Section */}
        <div className="bg-white p-4 rounded-lg shadow border flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-yellow-700">
              Cheque Details
            </h2>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
              Status: Posted
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Account Number:
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value="1231312123"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Account Name:
                </label>
                <input
                  type="text"
                  value="YES"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Check Number:
                </label>
                <input
                  type="text"
                  name="checkNumber"
                  value="00007111"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">BRSTN:</label>
                <input
                  type="text"
                  name="brstn"
                  value="112"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date:</label>
              <input
                type="date"
                name="date"
                value="2024-11-11"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Pay to the order of:
              </label>
              <input
                type="text"
                name="payee"
                value="MElvin Alvarez"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount:</label>
              <input
                type="number"
                name="amount"
                value="18600.00"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Amount in Words:
              </label>
              <input
                type="text"
                value="EIGHTEEN THOUSAND SIX HUNDRED PESOS"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Signatories Section */}
        <div className="bg-white p-4 rounded-lg shadow border flex-1">
          <h2 className="text-lg font-semibold mb-4 text-yellow-700">
            Signatories
          </h2>

          <div className="space-y-4">
            <div>
              <button className="w-full bg-blue-100 text-blue-800 py-2 px-4 rounded hover:bg-blue-200">
                Choose number 1
              </button>
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">
                  Signatory 1:
                </label>
                <select
                  value={selectedSignatory1}
                  onChange={(e) => setSelectedSignatory1(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Select signatory</option>
                  {signatories.map((sig) => (
                    <option key={sig.id} value={sig.name}>
                      {sig.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button className="w-full bg-blue-100 text-blue-800 py-2 px-4 rounded hover:bg-blue-200">
                Choose number 2
              </button>
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">
                  Signatory 2:
                </label>
                <select
                  value={selectedSignatory2}
                  onChange={(e) => setSelectedSignatory2(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Select signatory</option>
                  {signatories.map((sig) => (
                    <option key={sig.id} value={sig.name}>
                      {sig.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-yellow-700">
                Additional Info
              </h3>
              <textarea
                placeholder="Additional information..."
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {/* Check List Section */}
        <div className="xl:col-span-4 bg-white p-4 rounded-lg shadow border">
          <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col gap-4 mb-4">
            <h2 className="text-lg font-semibold">Check List</h2>
            <div className="flex items-center space-x-2">
              <div className="relative max-sm:w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 text-left">ID</th>
                  <th className="border border-gray-300 p-2 text-left">
                    Status
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Link ID
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Disbursement ID
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Bank Type
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Signal Type
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Account Number
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Account Name
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Check Number
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    BRSTN
                  </th>
                  <th className="border border-gray-300 p-2 text-left">Ch P</th>
                  <th className="border border-gray-300 p-2 text-left">P A</th>
                  <th className="border border-gray-300 p-2 text-left">V S</th>
                  <th className="border border-gray-300 p-2 text-left">S R</th>
                  <th className="border border-gray-300 p-2 text-left">A FP</th>
                </tr>
              </thead>
              <tbody>
                {filteredCheckList.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-300 p-2">{item.id}</td>
                    <td className="border border-gray-300 p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          item.status === "Posted"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.linkId}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.disbursementId}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.bankType}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.signalType}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.accountNumber}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.accountName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.checkNumber}
                    </td>
                    <td className="border border-gray-300 p-2">{item.brstn}</td>
                    <td className="border border-gray-300 p-2">{item.chP}</td>
                    <td className="border border-gray-300 p-2">{item.pA}</td>
                    <td className="border border-gray-300 p-2">{item.vS}</td>
                    <td className="border border-gray-300 p-2">{item.sR}</td>
                    <td className="border border-gray-300 p-2">{item.aFP}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Original Cheque Preview - keeping your existing functionality */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow border">
        <h2 className="text-lg font-medium mb-4">Cheque Preview</h2>
        <div className="border border-gray-300 p-6 rounded-lg bg-white shadow">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Bank</p>
                <p className="font-medium">
                  {banks.find((b) => b.value === chequeData.bank)?.label ||
                    "BDO-MSL - BDO Makati"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {chequeData.date
                    ? new Date(chequeData.date).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Pay to the Order of</p>
              <p className="font-medium text-lg border-b border-gray-300 pb-1">
                {chequeData.payee || "MElvin Alvarez"}
              </p>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Amount in Words</p>
                <p className="font-medium">
                  {chequeData.amount
                    ? amountToWords(chequeData.amount)
                    : "EIGHTEEN THOUSAND SIX HUNDRED PESOS ONLY"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium text-lg">
                  {chequeData.amount
                    ? new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(chequeData.amount)
                    : "₱18,600.00"}
                </p>
              </div>
            </div>

            <div className="mt-12 pt-4 border-t border-gray-300">
              <div className="text-center">
                <p className="text-sm text-gray-500">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChequeGeneratorPage;
