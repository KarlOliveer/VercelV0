export function validateEnv() {
  const requiredEnvs = ["JWT_SECRET_KEY"]
  const missingEnvs = requiredEnvs.filter((env) => !process.env[env])

  if (missingEnvs.length > 0) {
    console.warn(`
⚠️ Missing required environment variables:
${missingEnvs.map((env) => `- ${env}`).join("\n")}

To fix this:
1. Create a .env.local file in your project root
2. Add the missing variables:
${missingEnvs.map((env) => `${env}=your-${env.toLowerCase()}-here`).join("\n")}
3. Restart your development server
    `)
  }

  // Validate JWT_SECRET_KEY length
  if (process.env.JWT_SECRET_KEY && process.env.JWT_SECRET_KEY.length < 32) {
    console.warn("⚠️ JWT_SECRET_KEY should be at least 32 characters long for security")
  }
}

