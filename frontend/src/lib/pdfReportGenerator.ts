// frontend/src/lib/pdfReportGenerator.ts

export async function downloadAtsReportPdf(analysisData: any) {
  if (typeof window === "undefined") return;

  const score = analysisData.overallScore || 85;
  const targetRole = analysisData.targetRole || "Matched Job Description";
  const jobDescription = analysisData.jobDescription || "";
  const detectedSkills: string[] = analysisData.detectedSkills || [];
  const missingSkills: string[] = analysisData.missingSkills || [];
  const improvements: string[] = analysisData.improvements || [];
  const summary: string = analysisData.summary || "";

  // Create a clean, off-screen container for rendering printable PDF HTML
  const reportContainer = document.createElement("div");
  reportContainer.style.padding = "32px";
  reportContainer.style.fontFamily = "system-ui, -apple-system, sans-serif";
  reportContainer.style.color = "#0f172a";
  reportContainer.style.backgroundColor = "#ffffff";
  reportContainer.style.width = "750px";
  reportContainer.style.margin = "0 auto";

  reportContainer.innerHTML = `
    <div style="border-bottom: 3px solid #10b981; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1 style="margin: 0; font-size: 24px; color: #0f172a; font-weight: 800; tracking-tight: -0.5px;">
          PathFinder AI — ATS Job Match Report
        </h1>
        <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px; font-weight: 500;">
          Candidate Job Match Audit • Generated on ${new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <div style="background: #f59e0b; color: #020617; font-weight: 900; padding: 6px 14px; border-radius: 9999px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #d97706;">
        PRO UNLIMITED
      </div>
    </div>

    <!-- Overall Match Score Banner -->
    <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #059669; letter-spacing: 1px;">Target Job Match Score</span>
        <h2 style="margin: 4px 0 0 0; font-size: 24px; color: #0f172a; font-weight: 800;">${targetRole}</h2>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 38px; font-weight: 900; color: #059669; font-family: monospace; line-height: 1;">
          ${score} <span style="font-size: 18px; color: #64748b;">/ 100</span>
        </div>
        <span style="font-size: 11px; color: #059669; font-weight: 700; background: #d1fae5; padding: 2px 8px; border-radius: 9999px; display: inline-block; margin-top: 4px;">
          Strong Alignment Match
        </span>
      </div>
    </div>

    ${
      summary
        ? `
    <!-- AI Recruiter Strategy Summary -->
    <div style="background: #ecfdf5; border: 1.5px solid #6ee7b7; border-radius: 16px; padding: 18px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 6px 0; font-size: 13px; text-transform: uppercase; color: #047857; font-weight: 800; letter-spacing: 0.5px;">
        Recruiter Alignment Strategy
      </h3>
      <p style="margin: 0; font-size: 13px; color: #065f46; line-height: 1.6; font-weight: 500;">
        ${summary}
      </p>
    </div>
    `
        : ""
    }

    <!-- Matched & Missing Skills Grid -->
    <div style="display: flex; gap: 16px; margin-bottom: 24px;">
      <div style="flex: 1; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 18px;">
        <h4 style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; color: #059669; font-weight: 800; letter-spacing: 0.5px;">
          Matched Job Skills (${detectedSkills.length})
        </h4>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${
            detectedSkills.length > 0
              ? detectedSkills
                  .map(
                    (sk) =>
                      `<span style="background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700;">${sk}</span>`
                  )
                  .join("")
              : `<span style="font-size: 12px; color: #94a3b8;">None detected</span>`
          }
        </div>
      </div>

      <div style="flex: 1; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 18px;">
        <h4 style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; color: #d97706; font-weight: 800; letter-spacing: 0.5px;">
          Missing Key Requirements (${missingSkills.length})
        </h4>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${
            missingSkills.length > 0
              ? missingSkills
                  .map(
                    (sk) =>
                      `<span style="background: #fffbebfb; color: #b45309; border: 1px solid #fde68a; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700;">${sk}</span>`
                  )
                  .join("")
              : `<span style="font-size: 12px; color: #059669;">All key requirements matched!</span>`
          }
        </div>
      </div>
    </div>

    ${
      improvements.length > 0
        ? `
    <!-- Actionable Tailoring Recommendations -->
    <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; color: #0f172a; font-weight: 800; letter-spacing: 0.5px;">
        Actionable Resume Bullet Tailoring Recommendations
      </h3>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${improvements
          .map(
            (imp, idx) => `
          <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; font-size: 12px; color: #334155; line-height: 1.5; display: flex; gap: 10px;">
            <span style="color: #059669; font-weight: 800; font-family: monospace;">#${idx + 1}</span>
            <span>${imp}</span>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
    `
        : ""
    }

    <!-- Footer -->
    <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8;">
      <span>PathFinder AI — Career Optimization Platform</span>
      <span>Confidential & Proprietary Audit</span>
    </div>
  `;

  try {
    const html2pdfModule = await import("html2pdf.js");
    const html2pdf = html2pdfModule.default || html2pdfModule;

    const options = {
      margin: [10, 10, 10, 10],
      filename: `PathFinder_ATS_Audit_Report_${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(options).from(reportContainer).save();
  } catch (pdfErr) {
    console.error("html2pdf generation error, using window print fallback:", pdfErr);
    // Fallback: create print window
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>PathFinder ATS Audit Report</title></head>
          <body>${reportContainer.innerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  }
}
