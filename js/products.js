/* =========================
   KRAVA PRODUCTS DATABASE
========================= */

export const PRODUCTS = [
  {
    id: "game",
    name: "The Game",
    price: 750,
    oldPrice: 1000,
    colors: [
      { 
        name: "Pink", 
        hex: "#ff9acb", 
        images: [
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552428/game1_daablh.jpg",
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552428/game1back_n1gddr.jpg"],
        stock: { "M": 5, "L": 12, "XL": 0, "2XL": 3 } // 0 means Out of stock
      },
      { 
        name: "White", 
        hex: "#ffffff", 
        images: [
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552430/game4_i7qeuj.jpg",
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552431/game4back_mntad5.jpg"],
        stock: { "M": 0, "L": 8, "XL": 15, "2XL": 0 }
      },
      { 
        name: "Light-Gray", 
        hex: "#b3b3b3", 
        images: [
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552428/game2_zo5sxz.jpg",
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552429/game2back_hvi71d.jpg"
        ],
        stock: { "M": 10, "L": 20, "XL": 5, "2XL": 1 }
      },
      { 
        name: "Baby-Blue", 
        hex: "#9fd6ff", 
        images: [
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552432/game5_eedx9d.jpg", 
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552432/game5back_bsrlzz.jpg"
        ],
        stock: { "M": 7, "L": 0, "XL": 0, "2XL": 4 }
      },
      { 
        name: "Black", 
        hex: "#000000", 
        images: [
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552433/game3_b1psac.jpg",
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552434/game3back_wdh5si.jpg"],
        stock: { "M": 14, "L": 9, "XL": 22, "2XL": 11 }
      }
    ],
    sizes: ["M", "L", "XL", "2XL"]
  },

  {
    id: "no-fear",
    name: "NO FEAR",
    price: 600,
    oldPrice: 750,
    colors: [
      { 
        name: "Baby-Blue", 
        hex: "#9fd6ff", 
        images: ["https://res.cloudinary.com/paihc5qx/image/upload/v1788552735/no4_rwbgu4.jpg"],
        stock: { "M": 0, "L": 0, "XL": 5, "2XL": 8 }
      },
      { 
        name: "Pink", 
        hex: "#ff9acb", 
        images: ["https://res.cloudinary.com/paihc5qx/image/upload/v1788552729/no3_mzyrga.jpg"],
        stock: { "M": 10, "L": 10, "XL": 10, "2XL": 0 }
      },
      { 
        name: "White", 
        hex: "#ffffff", 
        images: ["https://res.cloudinary.com/paihc5qx/image/upload/v1788552728/no1_xiraj9.jpg"],
        stock: { "M": 3, "L": 4, "XL": 2, "2XL": 1 }
      },
      { 
        name: "Black", 
        hex: "#000000", 
        images: ["https://res.cloudinary.com/paihc5qx/image/upload/v1788552736/no5_lpo86u.jpg"],
        stock: { "M": 20, "L": 15, "XL": 12, "2XL": 9 }
      },
      { 
        name: "Light-Gray", 
        hex: "#b3b3b3", 
        images: ["https://res.cloudinary.com/paihc5qx/image/upload/v1788552729/no2_rfvvzh.jpg"],
        stock: { "M": 0, "L": 6, "XL": 7, "2XL": 2 }
      }
    ],
    sizes: ["M", "L", "XL", "2XL"]
  },

  {
    id: "world-is-mine",
    name: "World is Mine",
    price: 750,
    oldPrice: 1000,
    colors: [
      { 
        name: "White", 
        hex: "#ffffff", 
        images: [
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552920/map5_tkyqdf.jpg",
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552921/map5b_p9ryea.jpg"],
        stock: { "M": 8, "L": 14, "XL": 0, "2XL": 5 }
      },
      { 
        name: "Light-Gray", 
        hex: "#b3b3b3", 
        images: [
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552918/map4_rphv2m.jpg",
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552919/map4b_ylfeo2.jpg"
        ],
        stock: { "M": 4, "L": 0, "XL": 9, "2XL": 2 }
      },
      { 
        name: "Pink", 
        hex: "#ff9acb", 
        images: [
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552913/map2_mwg95o.jpg",
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552914/map2b_vijtjd.jpg"],
        stock: { "M": 0, "L": 3, "XL": 5, "2XL": 0 }
      },
      { 
        name: "Baby-Blue", 
        hex: "#9fd6ff", 
        images: [
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552915/map3_xewdar.jpg",
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552917/map3b_auxkd8.jpg"
        ],
        stock: { "M": 11, "L": 12, "XL": 13, "2XL": 14 }
      },
      { 
        name: "Black", 
        hex: "#000000", 
        images: [
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552911/map1_z8zjix.jpg",
          "https://res.cloudinary.com/paihc5qx/image/upload/v1788552912/map1b_kcwlrt.jpg"],
        stock: { "M": 6, "L": 7, "XL": 8, "2XL": 9 }
      }
    ],
    sizes: ["M", "L", "XL", "2XL"]
  }
];
