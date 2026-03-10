import { useParams } from "react-router-dom";
import { Button } from "@/components/lightswind/button";
import { motion } from "framer-motion";
import { Paperclip } from "lucide-react";

const policy = {
  id: 1,
  name: "Comprehensive Health Insurance",
  description: "A full-coverage health plan for individuals and families, offering extensive benefits including hospitalization, specialist consultations, and emergency services. This policy ensures peace of mind with a wide network of healthcare providers.",
  price: "$250/month",
  status: "Active",
  terms: `
1.  **Coverage Period:** The policy is valid for one calendar year from the date of purchase.
2.  **Eligibility:** Applicants must be between 18 and 65 years of age.
3.  **Premiums:** Monthly premiums are due on the 1st of each month. A grace period of 15 days is provided.
4.  **Claims:** Claims must be submitted within 30 days of the incident. All claims are subject to review and approval.
5.  **Exclusions:** The policy does not cover cosmetic procedures, pre-existing conditions for the first 24 months, or self-inflicted injuries.
  `,
  documents: [
    { name: "Policy Agreement", url: "#" },
    { name: "Product Disclosure Statement", url: "#" },
    { name: "Financial Services Guide", url: "#" },
  ],
};

const PolicyDetails = () => {
  const { id } = useParams();

  // In a real application, you would fetch the policy data based on the id.
  // For this example, we'll use the static policy object.

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {policy.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Policy ID: #{id}
                </p>
              </div>
              <div
                className={`px-4 py-2 text-lg font-semibold rounded-lg ${
                  policy.status === "Active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {policy.status}
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-200 text-base mb-8">
              {policy.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Terms and Conditions */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2">
                  Terms & Conditions
                </h2>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans">{policy.terms}</pre>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2">
                  Documents
                </h2>
                <ul className="space-y-3">
                  {policy.documents.map((doc, index) => (
                    <li key={index}>
                      <a
                        href={doc.url}
                        download
                        className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <Paperclip className="mr-2 h-5 w-5" />
                        {doc.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 flex justify-end gap-3">
              <Button variant="outline">Edit Policy</Button>
              <Button variant="destructive">Deactivate Policy</Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PolicyDetails;