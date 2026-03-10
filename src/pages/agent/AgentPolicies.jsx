import { useState } from "react";
import { Button } from "@/components/lightswind/button";
import { Input } from "@/components/lightswind/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/lightswind/dropdown-menu";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const policies = [
  {
    id: 1,
    name: "Comprehensive Health Insurance",
    description: "A full-coverage health plan for individuals and families.",
    price: "$250/month",
    status: "Active",
  },
  {
    id: 2,
    name: "Basic Auto Insurance",
    description: "Essential liability and damage coverage for your vehicle.",
    price: "$80/month",
    status: "Active",
  },
  {
    id: 3,
    name: "Homeowners Insurance",
    description: "Protection for your home and belongings against unforeseen events.",
    price: "$120/month",
    status: "Inactive",
  },
];

const AgentPolicies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  const filteredPolicies = policies
    .filter((policy) =>
      policy.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price.localeCompare(b.price, undefined, { numeric: true });
      } else if (sortOrder === "desc") {
        return b.price.localeCompare(a.price, undefined, { numeric: true });
      }
      return 0;
    });

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
          Policies
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Search policies..."
            className="w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Sort By</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Price</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                Descending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {filteredPolicies.map((policy) => (
          <motion.div
            key={policy.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {policy.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {policy.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {policy.price}
                </span>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    policy.status === "Active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {policy.status}
                </span>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Link to={`/agent/policies/${policy.id}`}>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AgentPolicies;
