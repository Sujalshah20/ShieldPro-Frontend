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
import { Badge } from "@/components/lightswind/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/lightswind/card";

const claims = [
  {
    id: "CLM001",
    policyHolder: "John Doe",
    policyType: "Health Insurance",
    agent: "Rajesh Kumar",
    status: "Approved",
    amount: "$1,200",
    date: "2024-05-20",
  },
  {
    id: "CLM002",
    policyHolder: "Jane Smith",
    policyType: "Auto Insurance",
    agent: "Rajesh Kumar",
    status: "Under Review",
    amount: "$800",
    date: "2024-05-22",
  },
  {
    id: "CLM003",
    policyHolder: "Peter Jones",
    policyType: "Homeowners Insurance",
    agent: "Sunita Sharma",
    status: "Rejected",
    amount: "$5,000",
    date: "2024-05-18",
  },
  {
    id: "CLM004",
    policyHolder: "Mary Johnson",
    policyType: "Health Insurance",
    agent: "Rajesh Kumar",
    status: "Approved",
    amount: "$350",
    date: "2024-05-15",
  },
];

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "Approved":
      return "success";
    case "Under Review":
      return "secondary";
    case "Rejected":
      return "destructive";
    default:
      return "default";
  }
};

const AdminClaims = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  const filteredClaims = claims
    .filter((claim) =>
      Object.values(claim).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (sortOrder === "asc") {
        return dateA - dateB;
      } else if (sortOrder === "desc") {
        return dateB - dateA;
      }
      return 0;
    });

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
          Claims Management
        </h1>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search claims..."
            className="w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Sort By Date</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                Oldest First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {filteredClaims.map((claim) => (
          <motion.div
            key={claim.id}
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{claim.policyType} - {claim.policyHolder}</CardTitle>
                <Badge variant={getStatusBadgeVariant(claim.status)}>
                  {claim.status}
                </Badge>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-600 dark:text-gray-400">Claim ID</p>
                  <p>{claim.id}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 dark:text-gray-400">Amount</p>
                  <p className="font-bold text-lg">{claim.amount}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 dark:text-gray-400">Agent</p>
                  <p>{claim.agent}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600 dark:text-gray-400">Date Filed</p>
                  <p>{claim.date}</p>
                </div>
                <div className="col-span-2 md:col-span-4 flex justify-end">
                    <Button size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AdminClaims;