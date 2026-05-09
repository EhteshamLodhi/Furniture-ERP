# Design System Document: The Architectural Ledger

## 1. Overview & Creative North Star
**Creative North Star: "The Master Craftsman’s Atelier"**
In the world of furniture manufacturing, precision meets materiality. This design system rejects the "spreadsheet-trapped-in-a-browser" aesthetic of legacy ERPs. Instead, it adopts the ethos of a high-end architectural studio: structured, authoritative, yet breathable. 

We move beyond the "template" look by utilizing **intentional asymmetry** and **tonal depth**. Large financial figures are treated with editorial importance, while dense data tables are housed in layered containers that prioritize legibility over rigid grid lines. The goal is to make complex supply chain and accounting data feel as curated and intentional as a bespoke piece of furniture.

---

## 2. Colors & Tonal Architecture
The palette transitions from the sterile white of traditional accounting to a sophisticated "Gallery Light" environment.

### The "No-Line" Rule
**Borders are a design failure.** To maintain a premium feel, 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined through:
*   **Background Shifts:** A `surface-container-low` (#f3f4f5) section sitting on a `surface` (#f8f9fa) background.
*   **Tonal Transitions:** Defining the edge of a sidebar by moving from `surface-container-highest` to `surface`.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. 
*   **Base Layer (`surface`):** The workshop floor. Everything begins here.
*   **Nesting:** Place `surface-container-lowest` (#ffffff) cards inside `surface-container` (#edeeef) panels. This creates a "recessed" or "elevated" feel without a single line of CSS border.

### The "Glass & Gradient" Rule
To elevate the ERP from "utility" to "experience," use semi-transparent `surface` colors with a 12px backdrop-blur for floating headers or modal overlays. For primary actions, use a subtle linear gradient:
*   **Signature CTA:** `primary` (#002046) to `primary_container` (#1B365D) at a 135-degree angle. This adds "soul" and a tactile, metallic depth.

---

## 3. Typography: The Financial Editorial
We pair **Manrope** (Display/Headline) for its geometric precision with **Inter** (Body/Label) for its peerless legibility in dense data.

*   **The Power Scale:**
    *   **Display-LG (Manrope, 3.5rem):** Reserved for "North Star" metrics—Total Revenue or Monthly Valuation.
    *   **Headline-SM (Manrope, 1.5rem):** Section titles (e.g., "Inventory Liquidity").
    *   **Body-MD (Inter, 0.875rem):** The workhorse. Used for table data and ledger entries.
    *   **Label-SM (Inter, 0.6875rem):** All-caps with 0.05em letter spacing for metadata (e.g., SKU numbers, timestamps).

**Typography as Identity:** Use `primary` (#002046) for headlines to project authority, and `on_surface_variant` (#44474E) for body text to reduce eye strain during long sessions.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows look "cheap" in an industrial context. We use **Ambient Depth**.

*   **The Layering Principle:** Depth is achieved by stacking. A card containing an Invoice should be `surface-container-lowest` (#ffffff) sitting on a background of `surface-container-low` (#f3f4f5).
*   **Ambient Shadows:** For "floating" elements like Tooltips or Dropdowns, use a 32px blur, 0px offset, and 4% opacity of the `primary` color. It should feel like a soft glow, not a drop shadow.
*   **The "Ghost Border":** If a table header requires a separator for accessibility, use `outline-variant` (#C4C6CF) at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism:** Navigation sidebars should use a semi-transparent `surface_container_low` with a `backdrop-filter: blur(20px)`. This allows the "colors" of the manufacturing floor (product photos/status badges) to bleed through subtly.

---

## 5. Components

### Cards & Modular Layouts
*   **The Rule:** No dividers. Use 24px (XL) or 32px (2XL) vertical spacing to separate content groups.
*   **Construction:** Use `roundness.md` (0.375rem) for a crisp, professional edge.

### Sticky Table Headers
*   **Styling:** Use `surface_bright` with a 90% opacity and a subtle `surface-tint` bottom edge. Financial columns (currency) must be tabular-numeric (monospaced) for vertical alignment.

### Buttons
*   **Primary:** Gradient of `primary` to `primary_container`. White text. No border.
*   **Secondary:** `surface_container_high` background with `on_primary_fixed_variant` text.
*   **Tertiary:** Text-only, using `secondary` (#006A6A) for a "Teal" highlight on interactive links.

### Input Fields
*   **State:** Default state uses `surface_container_highest`. On focus, transition the background to `surface_container_lowest` and add a 2px "Ghost Border" of `primary`. 
*   **Error:** Use `error_container` for the background fill and `on_error_container` for the label.

### Status Badges (The "Signal" System)
*   **Success (Paid/In Stock):** `secondary_fixed` background with `on_secondary_fixed_variant` text.
*   **Warning (Pending/Low Stock):** `tertiary_fixed` background with `on_tertiary_fixed_variant` text.
*   **Danger (Overdue/Out of Stock):** `error_container` background with `on_error` text.

---

## 6. Do's and Don'ts

### Do
*   **DO** use whitespace as a structural element. If data feels cluttered, increase the container padding before adding a line.
*   **DO** use `surface-container-highest` for the Sidebar background to create a clear "Control Zone."
*   **DO** use `secondary` (Teal) for "Growth" actions (New Order, Add Inventory).

### Don't
*   **DON'T** use 100% black (#000000). Use `on_background` (#191C1D) for high-contrast text.
*   **DON'T** use standard shadows. If it looks like a "box shadow" from 2014, it's too heavy.
*   **DON'T** use borders to separate rows in a table. Use alternating tonal stripes (Zebra striping) with `surface` and `surface_container_low`.