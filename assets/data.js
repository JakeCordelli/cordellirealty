// @ts-check

/**
 * @typedef {'FOR SALE' | 'UNDER CONTRACT' | 'SOLD' | 'FOR RENT' | 'RENTED'} ListingStatus
 */

/**
 * @typedef {'commercial' | 'multifamily' | 'residential' | 'rental'} AssetCategory
 */

/**
 * @typedef {Object} TransactionItem
 * @property {string} id
 * @property {ListingStatus} status
 * @property {AssetCategory} category
 * @property {boolean} isInvestment
 * @property {boolean} [isOffMarket]
 * @property {string} price
 * @property {number} numericPrice
 * @property {number} [askingPrice]
 * @property {string} street
 * @property {string} locality
 * @property {string} municipality
 * @property {string} county
 * @property {string[]} specs
 * @property {string} description
 * @property {string} represented
 * @property {string} mediaSrc
 * @property {string} alt
 * @property {string} [listingUrl]
 * @property {string} [coordinates]
 */

/**
 * @typedef {Object} HeroExecution
 * @property {string} id
 * @property {string} code
 * @property {string} classification
 * @property {string} title
 * @property {string} location
 * @property {string} coordinates
 * @property {string} headlineMetric
 * @property {string} secondaryMetric
 * @property {string} representation
 * @property {string} summary
 * @property {string} mediaSrc
 * @property {string} alt
 * @property {string} [transactionId]
 */

/**
 * @typedef {Object} ReviewItem
 * @property {string} quote
 * @property {string} author
 * @property {string} role
 * @property {'Google' | 'Zillow'} source
 */

export const FIRM_INFO = Object.freeze({
    name: "Cordelli Realty",
    founder: "Jake Cordelli",
    role: "Founder & Broker-Owner",
    license: "REB.0793614",
    established: 2021,
    street: "282 Main Street",
    cityState: "Wethersfield, CT",
    fullAddress: "282 Main Street, Wethersfield, CT",
    coordinates: "41.7143° N, 72.6526° W",
    phoneDisplay: "203.856.4317",
    phoneHref: "tel:+12038564317",
    email: "Jake@CordelliRealty.com",
    emailHref: "mailto:Jake@CordelliRealty.com",
    website: "https://cordellirealty.com/",
    zillowUrl: "https://www.zillow.com/profile/cordellirealty",
    googleReviewsUrl: "https://share.google/2RXLQpwNDX313o0mU",
    rating: "5.0"
});

/** @type {HeroExecution[]} */
export const HERO_EXECUTIONS = [
    {
        id: "exec-trumbull",
        code: "EXEC-01 // OFF-MARKET COMMERCIAL",
        classification: "CLOSED · DUAL REPRESENTATION",
        title: "6448 Main Street",
        location: "Trumbull, Connecticut",
        coordinates: "41.2738° N, 73.2248° W",
        headlineMetric: "$1,800,000",
        secondaryMetric: "178,000 SF · 274 Beds · Healthcare",
        representation: "Buyer & Seller · Off-Market",
        summary: "Discreet off-market disposition and acquisition of the former St. Joseph's Center skilled nursing and rehabilitation facility in Fairfield County.",
        mediaSrc: "./assets/media/6448-main-trumbull.webp",
        alt: "6448 Main Street commercial healthcare facility in Trumbull, Connecticut",
        transactionId: "tx-6448-main"
    },
    {
        id: "exec-chestnut",
        code: "EXEC-02 // MULTIFAMILY COMPOUND",
        classification: "CLOSED · DUAL REPRESENTATION",
        title: "19-29 Chestnut Street",
        location: "Willimantic, Connecticut",
        coordinates: "41.7148° N, 72.2122° W",
        headlineMetric: "$1,200,000",
        secondaryMetric: "11 Units · 38 Beds · Multi-Building",
        representation: "Buyer & Seller",
        summary: "Turnkey 11-unit university-corridor rental compound spanning two apartment buildings and a single-family residence near ECSU and UConn.",
        mediaSrc: "./assets/media/19-29-chestnut-willimantic.webp",
        alt: "19-29 Chestnut Street 11-unit multifamily compound in Willimantic, Connecticut",
        transactionId: "tx-19-29-chestnut"
    },
    {
        id: "exec-newhaven",
        code: "EXEC-03 // ACTIVE PIPELINE",
        classification: "ACTIVE · GREATER NEW HAVEN",
        title: "New Haven Multifamily Mandate",
        location: "New Haven, West Haven & Hamden, CT",
        coordinates: "41.3083° N, 72.9279° W",
        headlineMetric: "$2,950,000",
        secondaryMetric: "5 Assets · 14 Units · University Corridor",
        representation: "Direct Seller Representation",
        summary: "Curated active and under-contract 2-to-3 family investment offerings positioned across Westville, Downtown New Haven, West Haven, and Hamden.",
        mediaSrc: "./assets/media/217-alden-new-haven.webp",
        alt: "217 Alden Avenue multifamily investment property in New Haven, Connecticut",
        transactionId: "tx-217-alden"
    }
];

export const ADVISORY_CAPABILITIES = [
    {
        code: "01",
        tag: "LOW-OBSERVABLE",
        title: "Off-Market Dispositions",
        description: "Direct principal-to-principal matching for owners who require confidentiality, tenant continuity, and zero public listing fatigue."
    },
    {
        code: "02",
        tag: "INCOME ASSETS",
        title: "Multifamily & Portfolio Sales",
        description: "Acquisition and disposition advisory across 2-to-11+ unit holdings and university-corridor portfolios throughout Connecticut."
    },
    {
        code: "03",
        tag: "INSTITUTIONAL",
        title: "Commercial & Specialized Real Estate",
        description: "Transaction structuring for large-footprint healthcare facilities, adaptive reuse holdings, and mixed-use commercial assets."
    },
    {
        code: "04",
        tag: "PRECISION",
        title: "Analytical Underwriting & Presentation",
        description: "Computer-science-backed pricing discipline paired with in-house architectural photography and Sotheby's-trained presentation standards."
    }
];

export const EXECUTION_PROTOCOL = [
    {
        phase: "PHASE 01",
        code: "RECONNAISSANCE",
        title: "Asset Valuation & Underwriting",
        detail: "Granular rent-roll, comparable, and highest-and-best-use analysis grounded in live Connecticut market intelligence."
    },
    {
        phase: "PHASE 02",
        code: "CAPITAL ALIGNMENT",
        title: "Targeted Principal Outreach",
        detail: "Controlled distribution to pre-qualified private equity, family office, and regional operators — protecting asset privacy."
    },
    {
        phase: "PHASE 03",
        code: "EXECUTION",
        title: "Broker-Owner Closing Discipline",
        detail: "Direct negotiation led personally by Jake Cordelli from initial underwriting through LOI, diligence, and transfer."
    }
];

/** @type {TransactionItem[]} */
export const TRANSACTIONS = [
    {
        id: "tx-6448-main",
        status: "SOLD",
        category: "commercial",
        isInvestment: true,
        isOffMarket: true,
        price: "$1,800,000",
        numericPrice: 1800000,
        street: "6448 Main Street",
        locality: "Trumbull, Connecticut",
        municipality: "Trumbull",
        county: "Fairfield County",
        specs: ["178K SF", "274 Beds", "Healthcare"],
        description: "Off-market sale and acquisition of the former St. Joseph's Center, a large Trumbull healthcare property previously used for nursing, skilled nursing and rehabilitation services.",
        represented: "Buyer & Seller",
        mediaSrc: "./assets/media/6448-main-trumbull.webp",
        alt: "6448 Main Street, Trumbull, Connecticut",
        coordinates: "41.2738° N, 73.2248° W"
    },
    {
        id: "tx-19-29-chestnut",
        status: "SOLD",
        category: "multifamily",
        isInvestment: true,
        price: "$1,200,000",
        numericPrice: 1200000,
        street: "19-29 Chestnut Street",
        locality: "Willimantic, Connecticut",
        municipality: "Willimantic",
        county: "Windham County",
        specs: ["11 Family", "38 Beds", "11 Baths"],
        description: "Turnkey 11-unit rental compound near ECSU and UConn with 38 bedrooms across two apartment buildings and a single-family home, plus off-street parking and additional income space.",
        represented: "Buyer & Seller",
        mediaSrc: "./assets/media/19-29-chestnut-willimantic.webp",
        alt: "19-29 Chestnut Street, Willimantic, Connecticut",
        coordinates: "41.7148° N, 72.2122° W"
    },
    {
        id: "tx-217-alden",
        status: "FOR SALE",
        category: "multifamily",
        isInvestment: true,
        price: "$750,000",
        numericPrice: 750000,
        street: "217 Alden Avenue",
        locality: "New Haven, Connecticut",
        municipality: "New Haven",
        county: "New Haven County",
        specs: ["2 Family", "7 Beds", "3.5 Baths", "2,593 SF"],
        description: "Westville two-family offering seven total bedrooms, updated interiors, generous living space, a covered sun porch, private yard, and convenient access to universities and Downtown.",
        represented: "Seller",
        mediaSrc: "./assets/media/217-alden-new-haven.webp",
        alt: "217 Alden Avenue, New Haven, Connecticut",
        listingUrl: "https://www.zillow.com/homedetails/217-Alden-Ave-New-Haven-CT-06515/57972207_zpid/",
        coordinates: "41.3216° N, 72.9679° W"
    },
    {
        id: "tx-39-41-anthony",
        status: "FOR SALE",
        category: "multifamily",
        isInvestment: true,
        price: "$650,000",
        numericPrice: 650000,
        street: "39-41 Anthony Street",
        locality: "New Haven, Connecticut",
        municipality: "New Haven",
        county: "New Haven County",
        specs: ["3 Family", "7 Beds", "3 Baths", "3,262 SF"],
        description: "Desirable three-family property with updated units, hardwood floors, stainless steel appliances, off-street parking, and convenient access to Westville and area amenities.",
        represented: "Seller",
        mediaSrc: "./assets/media/39-41-anthony-new-haven.webp",
        alt: "39-41 Anthony Street, New Haven, Connecticut",
        listingUrl: "https://www.zillow.com/homedetails/39-41-Anthony-St-New-Haven-CT-06515/465953853_zpid/",
        coordinates: "41.3204° N, 72.9652° W"
    },
    {
        id: "tx-53-orlando",
        status: "FOR SALE",
        category: "multifamily",
        isInvestment: true,
        price: "$570,000",
        numericPrice: 570000,
        street: "53 Orlando Street",
        locality: "West Haven, Connecticut",
        municipality: "West Haven",
        county: "New Haven County",
        specs: ["3 Family", "8 Beds", "3 Baths", "2,768 SF"],
        description: "Updated three-family investment property near the University of New Haven with central air, granite counters, stainless appliances, flexible office space, and off-street parking.",
        represented: "Seller",
        mediaSrc: "./assets/media/53-orlando-west-haven.webp",
        alt: "53 Orlando Street, West Haven, Connecticut",
        listingUrl: "https://www.zillow.com/homedetails/53-Orlando-St-West-Haven-CT-06516/58036521_zpid/",
        coordinates: "41.2892° N, 72.9634° W"
    },
    {
        id: "tx-44-dudley",
        status: "FOR SALE",
        category: "multifamily",
        isInvestment: true,
        price: "$510,000",
        numericPrice: 510000,
        street: "44 Dudley Street",
        locality: "Hamden, Connecticut",
        municipality: "Hamden",
        county: "New Haven County",
        specs: ["3 Family", "7 Beds", "3 Baths"],
        description: "Flexible three-family property with hardwood floors, stainless steel appliances, private outdoor space, off-street parking, and convenient access to New Haven-area universities.",
        represented: "Seller",
        mediaSrc: "./assets/media/44-dudley-hamden.webp",
        alt: "44 Dudley Street, Hamden, Connecticut",
        listingUrl: "https://www.zillow.com/homedetails/44-Dudley-St-Hamden-CT-06517/57911347_zpid/",
        coordinates: "41.3456° N, 72.9227° W"
    },
    {
        id: "tx-11-dorman",
        status: "UNDER CONTRACT",
        category: "multifamily",
        isInvestment: true,
        price: "$470,000",
        numericPrice: 470000,
        street: "11 Dorman Street",
        locality: "New Haven, Connecticut",
        municipality: "New Haven",
        county: "New Haven County",
        specs: ["3 Family", "8 Beds", "3 Baths", "3,171 SF"],
        description: "Three-family investment or owner-occupant opportunity with three spacious apartments and convenient access to Downtown New Haven, universities, major employers, shopping, transit, and highways.",
        represented: "Seller",
        mediaSrc: "./assets/media/11-dorman-new-haven.webp",
        alt: "11 Dorman Street, New Haven, Connecticut",
        listingUrl: "https://www.zillow.com/homedetails/11-Dorman-St-New-Haven-CT-06511/57969729_zpid/",
        coordinates: "41.3264° N, 72.9293° W"
    },
    {
        id: "tx-52-stonewall",
        status: "SOLD",
        category: "residential",
        isInvestment: false,
        price: "$792,160",
        numericPrice: 792160,
        askingPrice: 775000,
        street: "52 Stonewall Road",
        locality: "Salem, Connecticut",
        municipality: "Salem",
        county: "New London County",
        specs: ["5 Beds", "4.5 Baths", "3,263 SF"],
        description: "Custom Fieldstone Farms Colonial on approximately two landscaped acres with a first-floor primary suite, finished walkout lower-level apartment, office, and three-car garage.",
        represented: "Seller",
        mediaSrc: "./assets/media/52-stonewall-salem.webp",
        alt: "52 Stonewall Road, Salem, Connecticut",
        listingUrl: "https://www.zillow.com/homedetails/52-Stonewall-Rd-Salem-CT-06420/80398182_zpid/"
    },
    {
        id: "tx-150-north",
        status: "SOLD",
        category: "multifamily",
        isInvestment: true,
        price: "$420,000",
        numericPrice: 420000,
        street: "150 North Street",
        locality: "Willimantic, Connecticut",
        municipality: "Willimantic",
        county: "Windham County",
        specs: ["7 Family", "14 Beds", "7 Baths"],
        description: "Grand seven-unit Victorian with large windows, original molding, a covered porch, off-street parking and varied apartment layouts near ECSU and Windham Hospital.",
        represented: "Seller",
        mediaSrc: "./assets/media/150-north-willimantic.webp",
        alt: "150 North Street, Willimantic, Connecticut"
    },
    {
        id: "tx-16-pine-tree",
        status: "SOLD",
        category: "residential",
        isInvestment: false,
        price: "$615,000",
        numericPrice: 615000,
        street: "16 Pine Tree Hill Road",
        locality: "Newtown, Connecticut",
        municipality: "Newtown",
        county: "Fairfield County",
        specs: ["4 Beds", "3 Baths", "Single Family"],
        description: "Private Newtown Colonial with an open floor plan, hardwood floors, island kitchen, fireplace, screened porch, deck and in-ground pool on more than two wooded acres.",
        represented: "Seller",
        mediaSrc: "./assets/media/16-pine-tree-hill-newtown.webp",
        alt: "16 Pine Tree Hill Road, Newtown, Connecticut"
    },
    {
        id: "tx-15-sachems",
        status: "SOLD",
        category: "residential",
        isInvestment: false,
        price: "$540,000",
        numericPrice: 540000,
        street: "15 Sachems Trail",
        locality: "Simsbury, Connecticut",
        municipality: "Simsbury",
        county: "Hartford County",
        specs: ["4 Beds", "3 Baths", "Single Family"],
        description: "Private cul-de-sac home on more than an acre beside protected land, with a fireplace, finished lower level, sunroom with hot tub, two-car garage and heated studio.",
        represented: "Seller",
        mediaSrc: "./assets/media/15-sachems-simsbury.webp",
        alt: "15 Sachems Trail, Simsbury, Connecticut"
    },
    {
        id: "tx-80-contour",
        status: "SOLD",
        category: "residential",
        isInvestment: false,
        price: "$469,500",
        numericPrice: 469500,
        street: "80 Contour Drive",
        locality: "Cheshire, Connecticut",
        municipality: "Cheshire",
        county: "New Haven County",
        specs: ["3 Beds", "2 Baths", "1,144 SF"],
        description: "Move-in-ready one-level ranch with hardwood floors, an updated kitchen and breakfast bar, main-level laundry, a fenced backyard, and extensive system updates.",
        represented: "Seller",
        mediaSrc: "https://photos.zillowstatic.com/fp/c9812cf0561de0cabec66588a08edda0-cc_ft_960.jpg",
        alt: "80 Contour Drive, Cheshire, Connecticut",
        listingUrl: "https://www.zillow.com/homedetails/80-Contour-Dr-Cheshire-CT-06410/57896231_zpid/"
    },
    {
        id: "tx-106-collelo",
        status: "SOLD",
        category: "residential",
        isInvestment: false,
        price: "$374,500",
        numericPrice: 374500,
        street: "106 Collelo Avenue",
        locality: "Moosup, Connecticut",
        municipality: "Moosup",
        county: "Windham County",
        specs: ["3 Beds", "2 Baths", "2.7 Acres"],
        description: "A 2.7-acre rural retreat with vaulted living space, French doors to a large deck, a pool, fire pit, expansive yard, updated kitchen and flexible lower-level living area.",
        represented: "Seller",
        mediaSrc: "./assets/media/106-collelo-moosup.webp",
        alt: "106 Collelo Avenue, Moosup, Connecticut"
    },
    {
        id: "tx-67-harold",
        status: "SOLD",
        category: "residential",
        isInvestment: false,
        price: "$287,000",
        numericPrice: 287000,
        street: "67 Harold Road",
        locality: "Farmington, Connecticut",
        municipality: "Farmington",
        county: "Hartford County",
        specs: ["3 Beds", "1 Bath", "Single Family"],
        description: "Raised-ranch renovation opportunity on a low-traffic street with a two-car garage, rough-plumbed unfinished basement and a large, level yard.",
        represented: "Buyer",
        mediaSrc: "./assets/media/67-harold-farmington.webp",
        alt: "67 Harold Road, Farmington, Connecticut"
    },
    {
        id: "tx-78-webster",
        status: "SOLD",
        category: "residential",
        isInvestment: false,
        price: "$241,000",
        numericPrice: 241000,
        street: "78 Webster Court",
        locality: "Newington, Connecticut",
        municipality: "Newington",
        county: "Hartford County",
        specs: ["2 Beds", "1 Bath", "Condo"],
        description: "Updated townhouse-style condo with granite counters, stainless appliances, open living and dining space, a private wooded patio and community pool access.",
        represented: "Buyer",
        mediaSrc: "./assets/media/78-webster-newington.webp",
        alt: "78 Webster Court, Newington, Connecticut"
    },
    {
        id: "tx-77-kennedy",
        status: "SOLD",
        category: "residential",
        isInvestment: false,
        price: "$240,000",
        numericPrice: 240000,
        street: "77 Kennedy Drive",
        locality: "Bridgeport, Connecticut",
        municipality: "Bridgeport",
        county: "Fairfield County",
        specs: ["2 Beds", "1 Bath", "Condo"],
        description: "Updated first-floor Candlelight Terrace condo with a granite-and-stainless kitchen, custom shower, private patio, wooded views, community pool and clubhouse.",
        represented: "Seller",
        mediaSrc: "./assets/media/77-kennedy-bridgeport.webp",
        alt: "77 Kennedy Drive, Bridgeport, Connecticut"
    },
    {
        id: "tx-72-prospect",
        status: "SOLD",
        category: "multifamily",
        isInvestment: true,
        price: "$195,000",
        numericPrice: 195000,
        street: "72 Prospect Street",
        locality: "Willimantic, Connecticut",
        municipality: "Willimantic",
        county: "Windham County",
        specs: ["2 Family", "8 Beds", "3 Baths"],
        description: "Updated Hill Section two-family Victorian with stained-glass detail, vaulted architectural accents, two porches, a garage and convenient access to ECSU and UConn.",
        represented: "Seller",
        mediaSrc: "./assets/media/72-prospect-willimantic.webp",
        alt: "72 Prospect Street, Willimantic, Connecticut"
    },
    {
        id: "tx-24-stony-brook",
        status: "SOLD",
        category: "residential",
        isInvestment: false,
        price: "$190,000",
        numericPrice: 190000,
        street: "24 Stony Brook Drive",
        locality: "Glastonbury, Connecticut",
        municipality: "Glastonbury",
        county: "Hartford County",
        specs: ["1 Bed", "1 Bath", "Condo"],
        description: "Hale Farms condo with an efficient one-bedroom layout and community amenities including pool and tennis; association services include heat, hot water, water and sewer.",
        represented: "Seller",
        mediaSrc: "./assets/media/24-stony-brook-glastonbury.webp",
        alt: "24 Stony Brook Drive, Glastonbury, Connecticut"
    },
    {
        id: "tx-262-church",
        status: "SOLD",
        category: "residential",
        isInvestment: false,
        price: "$180,000",
        numericPrice: 180000,
        street: "262 Church Street",
        locality: "Willimantic, Connecticut",
        municipality: "Willimantic",
        county: "Windham County",
        specs: ["4 Beds", "2 Baths", "Single Family"],
        description: "Hill Section Dutch Colonial with an updated kitchen, fireplace, finished attic, sunroom, perennial garden, private patio and garage.",
        represented: "Seller",
        mediaSrc: "./assets/media/262-church-willimantic.webp",
        alt: "262 Church Street, Willimantic, Connecticut"
    },
    {
        id: "tx-186-prospect",
        status: "SOLD",
        category: "residential",
        isInvestment: false,
        price: "$167,000",
        numericPrice: 167000,
        street: "186 Prospect Street",
        locality: "Willimantic, Connecticut",
        municipality: "Willimantic",
        county: "Windham County",
        specs: ["6 Beds", "2 Baths", "Single Family"],
        description: "Spacious historic home near ECSU and UConn with flexible living areas, two full baths, a finished third floor and strong rental appeal.",
        represented: "Seller",
        mediaSrc: "./assets/media/186-prospect-willimantic.webp",
        alt: "186 Prospect Street, Willimantic, Connecticut"
    },
    {
        id: "tx-377-park",
        status: "FOR RENT",
        category: "rental",
        isInvestment: false,
        price: "$3,950/mo",
        numericPrice: 3950,
        street: "377 Park Road #2",
        locality: "West Hartford, Connecticut",
        municipality: "West Hartford",
        county: "Hartford County",
        specs: ["4 Beds", "2 Baths", "2,000 SF"],
        description: "Second- and third-floor residence with hardwood floors, bay windows, central air, in-unit laundry, garage parking, and easy access to Park Road and West Hartford Center.",
        represented: "Landlord",
        mediaSrc: "https://photos.zillowstatic.com/fp/7ee785f0faba35027a17fdf2c1b181bf-cc_ft_960.jpg",
        alt: "377 Park Road #2, West Hartford, Connecticut",
        listingUrl: "https://www.raveis.com/prop/24211656/377-park-road-west-hartford-ct-06119"
    },
    {
        id: "tx-316-shore",
        status: "FOR RENT",
        category: "rental",
        isInvestment: false,
        price: "$2,400/mo",
        numericPrice: 2400,
        street: "316 Shore Drive",
        locality: "Coventry, Connecticut",
        municipality: "Coventry",
        county: "Tolland County",
        specs: ["3 Beds", "1 Bath", "1,096 SF"],
        description: "Fully furnished Coventry Lake home with in-unit laundry, furnished bedrooms, a spacious deck and yard, ample parking, and nearby beach and waterfront access.",
        represented: "Landlord",
        mediaSrc: "https://photos.zillowstatic.com/fp/0e61747770705e4bb14b9a101d6a367b-cc_ft_960.jpg",
        alt: "316 Shore Drive, Coventry, Connecticut",
        listingUrl: "https://www.zillow.com/homedetails/316-Shore-Dr-Coventry-CT-06238/58991233_zpid/"
    },
    {
        id: "tx-65-sefton",
        status: "FOR RENT",
        category: "rental",
        isInvestment: false,
        price: "$2,400/mo",
        numericPrice: 2400,
        street: "65 Sefton Drive — Floor 1",
        locality: "New Britain, Connecticut",
        municipality: "New Britain",
        county: "Hartford County",
        specs: ["3 Beds", "1 Bath", "1,015 SF"],
        description: "First-floor apartment near CCSU with hardwood floors, dishwasher, basement storage, shared laundry, off-street parking, and convenient access to shopping and major routes.",
        represented: "Landlord",
        mediaSrc: "https://photos.zillowstatic.com/fp/5b67af550ef753fe98dabd30196ba3c3-cc_ft_960.jpg",
        alt: "65 Sefton Drive Floor 1, New Britain, Connecticut",
        listingUrl: "https://www.zillow.com/homedetails/65-Sefton-Dr-FLOOR-1-New-Britain-CT-06053/2066977959_zpid/"
    },
    {
        id: "tx-118-cambridge",
        status: "FOR RENT",
        category: "rental",
        isInvestment: false,
        price: "$2,050/mo",
        numericPrice: 2050,
        street: "118 Cambridge Street #2",
        locality: "West Hartford, Connecticut",
        municipality: "West Hartford",
        county: "Hartford County",
        specs: ["2 Beds", "1 Bath", "700 SF"],
        description: "Character-filled apartment with hardwood floors, generous natural light, an enclosed porch, dishwasher, off-street parking, laundry hookups, outdoor space, and attic storage.",
        represented: "Landlord",
        mediaSrc: "https://photos.zillowstatic.com/fp/40e4201152f6a46ded63f0c22363973a-cc_ft_960.jpg",
        alt: "118 Cambridge Street Unit 2, West Hartford, Connecticut",
        listingUrl: "https://www.coldwellbankerhomes.com/ct/west-hartford/118-cambridge-st-2/pid_73938228/"
    },
    {
        id: "tx-38-n-main",
        status: "FOR RENT",
        category: "rental",
        isInvestment: false,
        price: "$1,925/mo",
        numericPrice: 1925,
        street: "38 N Main Street #2",
        locality: "West Hartford, Connecticut",
        municipality: "West Hartford",
        county: "Hartford County",
        specs: ["Studio", "1 Bath", "568 SF"],
        description: "All-utilities-included studio apartment in central West Hartford with a bright living area, well-appointed kitchen, wall-unit AC, shared laundry, and Blue Back Square access.",
        represented: "Landlord",
        mediaSrc: "https://photos.zillowstatic.com/fp/e4bf4c4828facc623cf37ab60a2d87a6-cc_ft_960.jpg",
        alt: "38 N Main Street Apartment 2, West Hartford, Connecticut",
        listingUrl: "https://www.zillow.com/homedetails/38-N-Main-St-APT-2-West-Hartford-CT-06107/241226209_zpid/"
    },
    {
        id: "tx-185-walnut",
        status: "RENTED",
        category: "rental",
        isInvestment: false,
        price: "$2,800/mo",
        numericPrice: 2800,
        street: "185 Walnut Street",
        locality: "Willimantic, Connecticut",
        municipality: "Willimantic",
        county: "Windham County",
        specs: ["5 Beds", "2.5 Baths", "1,588 SF"],
        description: "Spacious Victorian near ECSU and Main Street with hardwood floors, abundant natural light, a large kitchen, private laundry, parking, and heat and hot water included.",
        represented: "Landlord",
        mediaSrc: "https://m1.cbhomes.com/p/229/24205172/BaDff5ccee65403/pds23tp.webp",
        alt: "185 Walnut Street, Willimantic, Connecticut",
        listingUrl: "https://www.raveis.com/prop/24205172/185-walnut-street-windham-ct-06226"
    },
    {
        id: "tx-251-summit",
        status: "RENTED",
        category: "rental",
        isInvestment: false,
        price: "$2,800/mo",
        numericPrice: 2800,
        street: "251 Summit Street",
        locality: "Willimantic, Connecticut",
        municipality: "Willimantic",
        county: "Windham County",
        specs: ["5 Beds", "2 Baths", "1,616 SF"],
        description: "Spacious five-bedroom home near ECSU with hardwood floors, an updated stainless-steel kitchen, in-unit laundry, private parking, porch and yard space, and included heat and hot water.",
        represented: "Landlord",
        mediaSrc: "https://m1.cbhomes.com/p/229/24210253/CFee057A811c419/pds23tp.webp",
        alt: "251 Summit Street, Willimantic, Connecticut",
        listingUrl: "https://www.raveis.com/prop/24210253/251-summit-street-windham-ct-06226"
    },
    {
        id: "tx-41-spring",
        status: "RENTED",
        category: "rental",
        isInvestment: false,
        price: "$1,600/mo",
        numericPrice: 1600,
        street: "41 Spring Street #A",
        locality: "Willimantic, Connecticut",
        municipality: "Willimantic",
        county: "Windham County",
        specs: ["2 Beds", "1 Bath", "Apartment"],
        description: "Updated apartment near ECSU and Main Street with a large kitchen, dishwasher, spacious bedrooms, outdoor porch and yard access, and private off-street parking.",
        represented: "Landlord",
        mediaSrc: "https://photos.zillowstatic.com/fp/3252e2ab83a6b7f78a2b4c485647dbe8-cc_ft_960.jpg",
        alt: "41 Spring Street #A, Willimantic, Connecticut",
        listingUrl: "https://www.zillow.com/homedetails/41-Spring-St-A-Willimantic-CT-06226/465275299_zpid/"
    }
];

export const LEADERSHIP_CREDENTIALS = [
    {
        index: "01",
        title: "Former Sotheby's Agent",
        detail: "Luxury-brand training and international presentation standards applied to a boutique, broker-owner investment sales platform."
    },
    {
        index: "02",
        title: "Million-Dollar-Plus & Off-Market History",
        detail: "Proven execution positioning and negotiating complex healthcare, multi-building multifamily, and high-value transactions."
    },
    {
        index: "03",
        title: "Commercial + Residential Fluency",
        detail: "Cross-sector perspective on valuation, adaptive use, deal structure, and negotiation across commercial and residential assets."
    },
    {
        index: "04",
        title: "Computer Science Degree",
        detail: "Data-driven systems approach to pricing intelligence, capital tracking, digital distribution, and organized follow-through."
    },
    {
        index: "05",
        title: "Professional Real Estate Photographer",
        detail: "Hands-on mastery of architectural composition, lighting, and visual presentation that elevates buyer conviction on day one."
    }
];

/** @type {ReviewItem[]} */
export const REVIEWS = [
    {
        quote: "Jake is a true professional! … fantastic services, deep knowledge of the market, a great attitude…",
        author: "Brian M.",
        role: "Verified Client Review",
        source: "Zillow"
    },
    {
        quote: "Honest and truthful… I would use him again without question.",
        author: "Paul T.",
        role: "Verified Client Review",
        source: "Google"
    },
    {
        quote: "No one works harder to get your property listed and rented.",
        author: "Google Client",
        role: "Property Owner",
        source: "Google"
    },
    {
        quote: "Attentive and responsive. Highly recommended.",
        author: "Matt V.",
        role: "Rental Property Client",
        source: "Google"
    }
];
