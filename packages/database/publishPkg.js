const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const getLatestNpmVersion = packageName => {
  try {
    // Fetch latest version from npm
    const latestVersion = execSync(`npm show ${packageName} version`, {
      encoding: "utf8",
    }).trim();
    return latestVersion;
  } catch (err) {
    console.error("Error fetching latest version:", err);
    return null;
  }
};

const packageJsonPath = path.join(__dirname, "./package.json");
const packageJson = require(packageJsonPath);

const args = process.argv.slice(2); // Skip node and script paths

if (args.includes("--prepare")) {
  if (packageJson.dependencies["@cobuild/libs"] === "workspace:*") {
    const latestVersion = getLatestNpmVersion("@cobuild/libs");
    if (latestVersion) {
      packageJson.dependencies["@cobuild/libs"] = latestVersion;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
      console.log("Prepared for publishing.");
    }
  }
}

if (args.includes("--revert")) {
  //@cobuild/libs
  if (packageJson.dependencies["@cobuild/libs"] !== "workspace:*") {
    packageJson.dependencies["@cobuild/libs"] = "workspace:*";
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
    console.log("Reverted to workspace.");
  }
}
