/* Gweleni Construction — project data.
   One array drives the Projects page (cards, search, filter, sort, detail
   modal and map markers). To add a project, add one object here; no HTML
   needs editing. NOTE: `year` and `summary` text are descriptive
   placeholders — replace with the client's real details. */
window.GWELENI_PROJECTS = [
  {
    id: 'new-home-durbanville',
    title: 'Double-Storey New Build',
    category: 'New Builds',
    suburb: 'Durbanville',
    year: 2024,
    lat: -33.8321, lng: 18.6498,
    image: 'images/new-home-build.webp',
    alt: 'New double-storey home under construction in Durbanville, Cape Town',
    summary: 'A new double-storey family home built from foundation to roof, managed by one team from plans to handover.'
  },
  {
    id: 'kitchen-bellville',
    title: 'Open-Plan Kitchen Renovation',
    category: 'Renovations',
    suburb: 'Bellville',
    year: 2025,
    lat: -33.9000, lng: 18.6300,
    image: 'images/kitchen-renovation.webp',
    alt: 'Renovated white kitchen with under-cabinet lighting in Bellville, Cape Town',
    summary: 'A full kitchen remodel with new cabinetry, under-cabinet lighting and updated finishes.'
  },
  {
    id: 'bathroom-brackenfell',
    title: 'Modern Bathroom Renovation',
    category: 'Renovations',
    suburb: 'Brackenfell',
    year: 2025,
    lat: -33.8760, lng: 18.6930,
    image: 'images/bathroom-renovation.webp',
    alt: 'Renovated bathroom with glass shower and wooden-framed mirror in Brackenfell, Cape Town',
    summary: 'A bathroom renovation featuring a glass shower enclosure, new tiling and a wooden-framed mirror.'
  },
  {
    id: 'extension-tyger-valley',
    title: 'Home Extension',
    category: 'Extensions',
    suburb: 'Tyger Valley',
    year: 2023,
    lat: -33.8730, lng: 18.6310,
    image: 'images/home-extension.webp',
    alt: 'Home extension under construction with roof trusses in Tyger Valley, Cape Town',
    summary: 'An extension adding living space to an existing home, shown here at roof-truss stage.'
  },
  {
    id: 'roof-parow',
    title: 'Residential Roof Replacement',
    category: 'Roofing',
    suburb: 'Parow',
    year: 2024,
    lat: -33.9066, lng: 18.5990,
    image: 'images/roof-replacement.webp',
    alt: 'Roofing team replacing shingles on a residential roof in Parow, Cape Town',
    summary: 'A complete roof replacement with new roofing material and waterproofing.'
  },
  {
    id: 'retail-century-city',
    title: 'Retail Store Fit-Out',
    category: 'Commercial',
    suburb: 'Century City',
    year: 2023,
    lat: -33.8935, lng: 18.5120,
    image: 'images/retail-fitout.webp',
    alt: 'Completed retail store interior fit-out in Century City, Cape Town',
    summary: 'A light-commercial retail fit-out delivered to the tenant’s programme.'
  }
];
