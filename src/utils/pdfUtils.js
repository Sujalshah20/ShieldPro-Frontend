import { jsPDF } from "jspdf";

export const generatePolicyPDF = (userPolicy) => {
    const doc = new jsPDF();
    const { policy, policyNumber, premiumPaid, status, startDate } = userPolicy;

    // Header
    doc.setFillColor(37, 99, 235); // Blue primary
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("ShieldPro Insurance", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Official Policy Certificate", 105, 30, { align: "center" });

    // Body
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(16);
    doc.text("Policy Details", 20, 60);

    doc.setLineWidth(0.5);
    doc.line(20, 65, 190, 65);

    const details = [
        ["Policy Holder:", userPolicy.user?.name || "Valued Customer"],
        ["Policy ID:", policyNumber],
        ["Policy Name:", policy?.policyName],
        ["Policy Type:", policy?.policyType],
        ["Coverage Amount:", `₹${policy?.coverageAmount}`],
        ["Premium Paid:", `₹${premiumPaid}`],
        ["Status:", status],
        ["Start Date:", new Date(startDate).toLocaleDateString()],
    ];

    let yPos = 80;
    doc.setFontSize(12);
    details.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, 20, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(String(value), 70, yPos);
        yPos += 10;
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const footerText = "This is a computer-generated document and does not require a physical signature.";
    doc.text(footerText, 105, 280, { align: "center" });

    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 285, { align: "center" });

    // Save the PDF
    doc.save(`ShieldPro_Policy_${policyNumber}.pdf`);
};
