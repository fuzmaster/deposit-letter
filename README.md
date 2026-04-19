 # DepositLetter
 
 DepositLetter is a browser-based security deposit deduction letter generator for landlords and property managers. It helps you enter tenancy details, itemize deductions, preview the final notice in real time, and export a clean PDF through the browser print dialog.

 ## What It Does
 
 - Captures landlord, tenant, property, forwarding address, and move-out details
 - Tracks original deposit, accrued interest, and itemized deductions
 - Calculates total available funds, total deductions, and remaining balance automatically
 - Validates required fields before allowing export
 - Generates a print-ready letter preview that can be saved as PDF
 - Works entirely in the browser with no backend required
 
 ## Built With
 
 - React 19
 - Vite 8
 - ESLint 9
 
 ## Local Development
 
 1. Install dependencies:
 
 ```bash
 npm install
 ```
 
 2. Start the development server:
 
 ```bash
 npm run dev
 ```
 
 3. Open the local app URL shown in the terminal, usually:
 
 ```bash
 http://localhost:5173
 ```
 
 ## Available Scripts
 
 ```bash
 npm run dev
 npm run build
 npm run preview
 npm run lint
 ```
 
 ## How PDF Export Works
 
 DepositLetter does not generate PDFs on a server. Instead, it renders a letter preview in the app and uses the browser print flow.
 
 To export a PDF:
 
 1. Complete the required fields.
 2. Click `Download PDF Letter` or `Preview & Download`.
 3. In the browser print dialog, choose `Save as PDF` as the destination.
 
 ## Validation Rules
 
 The app checks that:
 
 - Landlord name is present
 - Landlord return address is present
 - Tenant name is present
 - Property address is present
 - Notice date is present
 - Move-out date is present
 - Original deposit is present and not negative
 - Interest is not negative
 - Each deduction has both a description and an amount when either is entered
 - Deduction amounts are not negative
 
 ## Project Structure
 
 ```text
 src/
	 App.jsx
	 App.css
	 main.jsx
	 assets/
	 components/
		 FormPanel.jsx
		 LetterPreview.jsx
 ```
 
 ## Deployment
 
 This project is a static Vite app and can be deployed on platforms like Vercel, Netlify, or GitHub Pages.
 
 For Vercel:
 
 1. Import the repository in Vercel, or deploy with the CLI.
 2. Use the default Vite build settings.
 3. Build command: `npm run build`
 4. Output directory: `dist`
 
 ## Disclaimer
 
 This tool formats a document for convenience. It does not provide legal advice. Landlords remain responsible for complying with state and local notice, timing, and security deposit laws.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
