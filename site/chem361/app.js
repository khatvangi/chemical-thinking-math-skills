const questions = [
  {
    type: "2D structure",
    formula: "[Cr(NH3)4Cl2]Cl",
    geometry: "Octahedral",
    note: "Provide the full IUPAC name. Include oxidation state, ligand order, and counter ion.",
    diagram: {
      central: "Cr",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "NH3",
        front: "Cl-",
        back: "Cl-",
      },
    },
    accepted: ["tetraammine dichlorochromium(iii) chloride"],
    rationale: "Cr is +3 (ammine neutral, two chloro ligands, one counter chloride).",
  },
  {
    type: "formula",
    formula: "[Co(NH3)6]Cl3",
    geometry: "Octahedral",
    note: "Name the complex cation and counter ion.",
    difficulty: "intro",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "NH3",
        front: "NH3",
        back: "NH3",
      },
    },
    accepted: ["hexaamminecobalt(iii) chloride"],
    rationale: "Six neutral ammine ligands; three chloride counter ions imply Co(III).",
  },
  {
    type: "formula",
    formula: "K2[PtCl6]",
    geometry: "Octahedral",
    note: "Remember -ate for anionic complexes.",
    diagram: {
      central: "Pt",
      ligands: {
        top: "Cl-",
        bottom: "Cl-",
        left: "Cl-",
        right: "Cl-",
        front: "Cl-",
        back: "Cl-",
      },
    },
    accepted: ["potassium hexachloroplatinate(iv)"],
    rationale: "Complex is 2-; Pt is +4, so platinate(IV).",
  },
  {
    type: "2D structure",
    formula: "[Cu(en)2(H2O)2]SO4",
    geometry: "Octahedral",
    note: "Use bis for polydentate ligands. Order ligands alphabetically.",
    diagram: {
      central: "Cu",
      ligands: {
        top: "H2O",
        bottom: "H2O",
        left: "en",
        right: "en",
        front: "en",
        back: "en",
      },
    },
    accepted: [
      "diaqua bis(ethylenediamine)copper(ii) sulfate",
      "diaqua bis(ethylenediamine) copper(ii) sulfate",
    ],
    rationale: "Sulfate is 2-, so Cu is +2. Aqua before ethylenediamine.",
  },
  {
    type: "formula",
    formula: "Na2[Ni(CN)4]",
    geometry: "Square planar",
    note: "Cyanide is anionic; complex is 2-.",
    diagram: {
      central: "Ni",
      ligands: {
        top: "CN-",
        bottom: "CN-",
        left: "CN-",
        right: "CN-",
      },
    },
    accepted: ["sodium tetracyanonickelate(ii)"],
    rationale: "Nickelate(II) for anionic complex; four cyano ligands.",
  },
  {
    type: "formula",
    formula: "[Ag(NH3)2]NO3",
    geometry: "Linear",
    note: "Two neutral ligands on Ag; use diammine.",
    difficulty: "intro",
    diagram: {
      central: "Ag",
      ligands: {
        left: "NH3",
        right: "NH3",
      },
    },
    accepted: ["diamminesilver(i) nitrate"],
    rationale: "Ag is +1 with neutral ligands; nitrate is the counter ion.",
  },
  {
    type: "formula",
    formula: "K4[Fe(CN)6]",
    geometry: "Octahedral",
    note: "Anionic complex: use ferrate.",
    diagram: {
      central: "Fe",
      ligands: {
        top: "CN-",
        bottom: "CN-",
        left: "CN-",
        right: "CN-",
        front: "CN-",
        back: "CN-",
      },
    },
    accepted: ["potassium hexacyanoferrate(ii)"],
    rationale: "Complex is 4-; Fe is +2.",
  },
  {
    type: "formula",
    formula: "K3[Fe(CN)6]",
    geometry: "Octahedral",
    note: "Anionic complex: use ferrate.",
    diagram: {
      central: "Fe",
      ligands: {
        top: "CN-",
        bottom: "CN-",
        left: "CN-",
        right: "CN-",
        front: "CN-",
        back: "CN-",
      },
    },
    accepted: ["potassium hexacyanoferrate(iii)"],
    rationale: "Complex is 3-; Fe is +3.",
  },
  {
    type: "formula",
    formula: "[Co(NH3)5Cl]Cl2",
    geometry: "Octahedral",
    note: "Mixed ligands: order alphabetically.",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "NH3",
        front: "NH3",
        back: "Cl-",
      },
    },
    accepted: ["pentaamminechlorocobalt(iii) chloride"],
    rationale: "Co is +3; two chloride counter ions.",
  },
  {
    type: "formula",
    formula: "[Co(NH3)5Cl]SO4",
    geometry: "Octahedral",
    note: "Remember the counter ion name.",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "NH3",
        front: "NH3",
        back: "Cl-",
      },
    },
    accepted: ["pentaamminechlorocobalt(iii) sulfate"],
    rationale: "Complex is 2+; sulfate balances charge.",
  },
  {
    type: "formula",
    formula: "[Cr(H2O)6]Cl3",
    geometry: "Octahedral",
    note: "Water is neutral; include oxidation state.",
    difficulty: "intro",
    diagram: {
      central: "Cr",
      ligands: {
        top: "H2O",
        bottom: "H2O",
        left: "H2O",
        right: "H2O",
        front: "H2O",
        back: "H2O",
      },
    },
    accepted: ["hexaaquachromium(iii) chloride"],
    rationale: "Cr is +3 with neutral aqua ligands.",
  },
  {
    type: "formula",
    formula: "[Cu(NH3)4(H2O)2]SO4",
    geometry: "Octahedral",
    note: "Alphabetize ligand names (ammine before aqua).",
    diagram: {
      central: "Cu",
      ligands: {
        top: "H2O",
        bottom: "H2O",
        left: "NH3",
        right: "NH3",
        front: "NH3",
        back: "NH3",
      },
    },
    accepted: ["tetraammine diaquacopper(ii) sulfate"],
    rationale: "Cu is +2; sulfate is the counter ion.",
  },
  {
    type: "formula",
    formula: "[Zn(NH3)4]SO4",
    geometry: "Tetrahedral",
    note: "Neutral ligands with sulfate counter ion.",
    difficulty: "intro",
    diagram: {
      central: "Zn",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "NH3",
      },
    },
    accepted: ["tetraamminezinc(ii) sulfate"],
    rationale: "Zn is +2 with neutral ligands.",
  },
  {
    type: "formula",
    formula: "[Ni(H2O)6]Cl2",
    geometry: "Octahedral",
    note: "Simple aqua complex.",
    difficulty: "intro",
    diagram: {
      central: "Ni",
      ligands: {
        top: "H2O",
        bottom: "H2O",
        left: "H2O",
        right: "H2O",
        front: "H2O",
        back: "H2O",
      },
    },
    accepted: ["hexaaquanickel(ii) chloride"],
    rationale: "Ni is +2; two chloride counter ions.",
  },
  {
    type: "formula",
    formula: "[Pt(NH3)2Cl2]",
    geometry: "Square planar",
    note: "Neutral complex; no counter ion.",
    diagram: {
      central: "Pt",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "Cl-",
        right: "Cl-",
      },
    },
    accepted: ["diamminedichloroplatinum(ii)"],
    rationale: "Pt is +2; two neutral ammines and two chloro ligands.",
  },
  {
    type: "formula",
    formula: "K2[Pt(NH3)2Cl4]",
    geometry: "Octahedral",
    note: "Anionic complex with neutral ammines.",
    diagram: {
      central: "Pt",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "Cl-",
        right: "Cl-",
        front: "Cl-",
        back: "Cl-",
      },
    },
    accepted: ["potassium diamminetetrachloroplatinate(ii)"],
    rationale: "Complex is 2-; Pt is +2.",
  },
  {
    type: "formula",
    formula: "[Co(en)3]Cl3",
    geometry: "Octahedral",
    note: "Use tris for polydentate ligands.",
    diagram: {
      central: "Co",
      ligands: {
        top: "en",
        bottom: "en",
        left: "en",
        right: "en",
        front: "en",
        back: "en",
      },
    },
    accepted: [
      "tris(ethylenediamine)cobalt(iii) chloride",
      "tris(ethylenediamine) cobalt(iii) chloride",
    ],
    rationale: "Co is +3 with three neutral bidentate ligands.",
  },
  {
    type: "formula",
    formula: "[Cr(en)2Cl2]Cl",
    geometry: "Octahedral",
    note: "Alphabetize chloro before ethylenediamine.",
    diagram: {
      central: "Cr",
      ligands: {
        top: "Cl-",
        bottom: "Cl-",
        left: "en",
        right: "en",
        front: "en",
        back: "en",
      },
    },
    accepted: [
      "dichlorobis(ethylenediamine)chromium(iii) chloride",
      "dichloro bis(ethylenediamine)chromium(iii) chloride",
    ],
    rationale: "Cr is +3; complex is +1 with one counter chloride.",
  },
  {
    type: "formula",
    formula: "[Ni(en)2Cl2]",
    geometry: "Octahedral",
    note: "Neutral complex with bidentate ligands.",
    diagram: {
      central: "Ni",
      ligands: {
        top: "Cl-",
        bottom: "Cl-",
        left: "en",
        right: "en",
        front: "en",
        back: "en",
      },
    },
    accepted: [
      "dichlorobis(ethylenediamine)nickel(ii)",
      "dichloro bis(ethylenediamine)nickel(ii)",
    ],
    rationale: "Ni is +2; overall neutral.",
  },
  {
    type: "formula",
    formula: "[Fe(H2O)5Cl]Cl2",
    geometry: "Octahedral",
    note: "Mixed aqua and chloro ligands.",
    diagram: {
      central: "Fe",
      ligands: {
        top: "H2O",
        bottom: "H2O",
        left: "H2O",
        right: "H2O",
        front: "H2O",
        back: "Cl-",
      },
    },
    accepted: ["pentaaquachloroiron(iii) chloride"],
    rationale: "Fe is +3; two chloride counter ions.",
  },
  {
    type: "formula",
    formula: "[Co(NH3)4Cl2]Cl",
    geometry: "Octahedral",
    note: "Classic ammine complex.",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "NH3",
        front: "Cl-",
        back: "Cl-",
      },
    },
    accepted: ["tetraammine dichlorocobalt(iii) chloride"],
    rationale: "Co is +3; one counter chloride.",
  },
  {
    type: "formula",
    formula: "K2[CuCl4]",
    geometry: "Tetrahedral",
    note: "Anionic complex: use cuprate.",
    diagram: {
      central: "Cu",
      ligands: {
        top: "Cl-",
        bottom: "Cl-",
        left: "Cl-",
        right: "Cl-",
      },
    },
    accepted: ["potassium tetrachlorocuprate(ii)"],
    rationale: "Complex is 2-; Cu is +2.",
  },
  {
    type: "formula",
    formula: "Na2[Zn(OH)4]",
    geometry: "Tetrahedral",
    note: "Hydroxo is an anionic ligand.",
    diagram: {
      central: "Zn",
      ligands: {
        top: "OH-",
        bottom: "OH-",
        left: "OH-",
        right: "OH-",
      },
    },
    accepted: ["sodium tetrahydroxozincate(ii)"],
    rationale: "Complex is 2-; Zn is +2.",
  },
  {
    type: "formula",
    formula: "[Al(H2O)6]Cl3",
    geometry: "Octahedral",
    note: "Water is neutral; include oxidation state.",
    difficulty: "intro",
    diagram: {
      central: "Al",
      ligands: {
        top: "H2O",
        bottom: "H2O",
        left: "H2O",
        right: "H2O",
        front: "H2O",
        back: "H2O",
      },
    },
    accepted: ["hexaaquaaluminum(iii) chloride"],
    rationale: "Al is +3; three chloride counter ions.",
  },
  {
    type: "formula",
    formula: "[Fe(H2O)6]SO4",
    geometry: "Octahedral",
    note: "Sulfate counter ion implies Fe(II).",
    difficulty: "intro",
    diagram: {
      central: "Fe",
      ligands: {
        top: "H2O",
        bottom: "H2O",
        left: "H2O",
        right: "H2O",
        front: "H2O",
        back: "H2O",
      },
    },
    accepted: ["hexaaquairon(ii) sulfate"],
    rationale: "Complex is 2+; sulfate is 2-.",
  },
  {
    type: "formula",
    formula: "[Cr(NH3)5(H2O)]Cl3",
    geometry: "Octahedral",
    note: "Alphabetize ammine before aqua.",
    diagram: {
      central: "Cr",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "NH3",
        front: "NH3",
        back: "H2O",
      },
    },
    accepted: ["pentaammineaquachromium(iii) chloride"],
    rationale: "Cr is +3; three chloride counter ions.",
  },
  {
    type: "formula",
    formula: "[Co(NH3)3Cl3]",
    geometry: "Octahedral",
    note: "Neutral complex; no counter ion.",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "Cl-",
        front: "Cl-",
        back: "Cl-",
      },
    },
    accepted: ["triamminetrichlorocobalt(iii)"],
    rationale: "Co is +3; three chloro ligands balance charge.",
  },
  {
    type: "formula",
    formula: "[Co(en)2Cl2]Cl",
    geometry: "Octahedral",
    note: "Use bis with ethylenediamine.",
    diagram: {
      central: "Co",
      ligands: {
        top: "Cl-",
        bottom: "Cl-",
        left: "en",
        right: "en",
        front: "en",
        back: "en",
      },
    },
    accepted: [
      "dichlorobis(ethylenediamine)cobalt(iii) chloride",
      "dichloro bis(ethylenediamine)cobalt(iii) chloride",
    ],
    rationale: "Co is +3; complex is +1 with one counter chloride.",
  },
  {
    type: "formula",
    formula: "[Ni(CO)4]",
    geometry: "Tetrahedral",
    note: "Carbonyls are neutral ligands; metal oxidation state is zero.",
    difficulty: "intro",
    diagram: {
      central: "Ni",
      ligands: {
        top: "CO",
        bottom: "CO",
        left: "CO",
        right: "CO",
      },
    },
    accepted: ["tetracarbonylnickel(0)"],
    rationale: "All ligands are neutral; Ni is 0.",
  },
  {
    type: "formula",
    formula: "[Fe(CO)5]",
    geometry: "Trigonal bipyramidal",
    note: "Five carbonyl ligands; oxidation state zero.",
    diagram: {
      central: "Fe",
      ligands: {
        top: "CO",
        bottom: "CO",
        left: "CO",
        right: "CO",
        front: "CO",
      },
    },
    accepted: ["pentacarbonyliron(0)"],
    rationale: "All ligands are neutral; Fe is 0.",
  },
  {
    type: "formula",
    formula: "[Cr(CO)6]",
    geometry: "Octahedral",
    note: "Carbonyl complex with six ligands.",
    diagram: {
      central: "Cr",
      ligands: {
        top: "CO",
        bottom: "CO",
        left: "CO",
        right: "CO",
        front: "CO",
        back: "CO",
      },
    },
    accepted: ["hexacarbonylchromium(0)"],
    rationale: "All ligands are neutral; Cr is 0.",
  },
  {
    type: "formula",
    formula: "[Co(NH3)4(H2O)2]Cl3",
    geometry: "Octahedral",
    note: "Aqua and ammine ligands; alphabetize names.",
    diagram: {
      central: "Co",
      ligands: {
        top: "H2O",
        bottom: "H2O",
        left: "NH3",
        right: "NH3",
        front: "NH3",
        back: "NH3",
      },
    },
    accepted: ["tetraammine diaquacobalt(iii) chloride"],
    rationale: "Co is +3; three chloride counter ions.",
  },
  {
    type: "formula",
    formula: "[Pt(NH3)4]Cl2",
    geometry: "Square planar",
    note: "Neutral ligands with two counter chlorides.",
    diagram: {
      central: "Pt",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "NH3",
      },
    },
    accepted: ["tetraammineplatinum(ii) chloride"],
    rationale: "Pt is +2; two chloride counter ions.",
  },
  {
    type: "formula",
    formula: "K[AuCl4]",
    geometry: "Square planar",
    note: "Anionic complex: use aurate.",
    diagram: {
      central: "Au",
      ligands: {
        top: "Cl-",
        bottom: "Cl-",
        left: "Cl-",
        right: "Cl-",
      },
    },
    accepted: ["potassium tetrachloroaurate(iii)"],
    rationale: "Complex is 1-; Au is +3.",
  },
  {
    type: "formula",
    formula: "K[Ag(CN)2]",
    geometry: "Linear",
    note: "Use argentate for anionic silver complex.",
    diagram: {
      central: "Ag",
      ligands: {
        left: "CN-",
        right: "CN-",
      },
    },
    accepted: ["potassium dicyanoargentate(i)"],
    rationale: "Complex is 1-; Ag is +1.",
  },
  {
    type: "formula",
    formula: "[Co(NH3)5(NO2)]Cl2",
    geometry: "Octahedral",
    note: "NO2- bound through N is named nitro.",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "NH3",
        front: "NH3",
        back: "NO2-",
      },
    },
    accepted: ["pentaammine nitrocobalt(iii) chloride"],
    rationale: "Co is +3; two chloride counter ions.",
  },
  {
    type: "formula",
    formula: "[Co(NH3)5(ONO)]Cl2",
    geometry: "Octahedral",
    note: "ONO- bound through O is named nitrito.",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "NH3",
        front: "NH3",
        back: "ONO-",
      },
    },
    accepted: ["pentaammine nitritocobalt(iii) chloride"],
    rationale: "Co is +3; two chloride counter ions.",
  },
  {
    type: "formula",
    formula: "[Cr(H2O)4Cl2]Cl",
    geometry: "Octahedral",
    note: "Mixed aqua and chloro ligands.",
    diagram: {
      central: "Cr",
      ligands: {
        top: "H2O",
        bottom: "H2O",
        left: "H2O",
        right: "H2O",
        front: "Cl-",
        back: "Cl-",
      },
    },
    accepted: ["tetraaquadichlorochromium(iii) chloride"],
    rationale: "Cr is +3; one counter chloride.",
  },
  {
    type: "formula",
    formula: "[Ni(H2O)4Cl2]",
    geometry: "Octahedral",
    note: "Neutral complex with aqua and chloro ligands.",
    diagram: {
      central: "Ni",
      ligands: {
        top: "H2O",
        bottom: "H2O",
        left: "H2O",
        right: "H2O",
        front: "Cl-",
        back: "Cl-",
      },
    },
    accepted: ["tetraaquadichloronickel(ii)"],
    rationale: "Ni is +2; overall neutral.",
  },
  {
    type: "formula",
    formula: "[Cu(NH3)2Cl2]",
    geometry: "Square planar",
    note: "Two neutral and two anionic ligands.",
    diagram: {
      central: "Cu",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "Cl-",
        right: "Cl-",
      },
    },
    accepted: ["diamminedichlorocopper(ii)"],
    rationale: "Cu is +2; neutral complex.",
  },
  {
    type: "isomer",
    formula: "cis-[Pt(NH3)2Cl2]",
    geometry: "Square planar",
    note: "Include the stereodescriptor for square planar complexes.",
    difficulty: "advanced",
    diagram: {
      central: "Pt",
      ligands: {
        top: "Cl-",
        bottom: "NH3",
        left: "Cl-",
        right: "NH3",
      },
    },
    compare: {
      label: "trans isomer",
      diagram: {
        central: "Pt",
        ligands: {
          top: "NH3",
          bottom: "NH3",
          left: "Cl-",
          right: "Cl-",
        },
      },
    },
    accepted: ["cis-diamminedichloroplatinum(ii)"],
    rationale: "Cis isomer; Pt is +2.",
  },
  {
    type: "isomer",
    formula: "trans-[Pt(NH3)2Cl2]",
    geometry: "Square planar",
    note: "Include the stereodescriptor for square planar complexes.",
    difficulty: "advanced",
    diagram: {
      central: "Pt",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "Cl-",
        right: "Cl-",
      },
    },
    compare: {
      label: "cis isomer",
      diagram: {
        central: "Pt",
        ligands: {
          top: "Cl-",
          bottom: "NH3",
          left: "Cl-",
          right: "NH3",
        },
      },
    },
    accepted: ["trans-diamminedichloroplatinum(ii)"],
    rationale: "Trans isomer; Pt is +2.",
  },
  {
    type: "isomer",
    formula: "cis-[Co(NH3)4Cl2]Cl",
    geometry: "Octahedral",
    note: "Cis/trans apply to octahedral complexes with two identical ligands.",
    difficulty: "advanced",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "Cl-",
        front: "NH3",
        back: "Cl-",
      },
    },
    compare: {
      label: "trans isomer",
      diagram: {
        central: "Co",
        ligands: {
          top: "NH3",
          bottom: "NH3",
          left: "NH3",
          right: "NH3",
          front: "Cl-",
          back: "Cl-",
        },
      },
    },
    accepted: ["cis-tetraamminedichlorocobalt(iii) chloride"],
    rationale: "Cis isomer; Co is +3.",
  },
  {
    type: "isomer",
    formula: "trans-[Co(NH3)4Cl2]Cl",
    geometry: "Octahedral",
    note: "Cis/trans apply to octahedral complexes with two identical ligands.",
    difficulty: "advanced",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "NH3",
        front: "Cl-",
        back: "Cl-",
      },
    },
    compare: {
      label: "cis isomer",
      diagram: {
        central: "Co",
        ligands: {
          top: "NH3",
          bottom: "NH3",
          left: "NH3",
          right: "Cl-",
          front: "NH3",
          back: "Cl-",
        },
      },
    },
    accepted: ["trans-tetraamminedichlorocobalt(iii) chloride"],
    rationale: "Trans isomer; Co is +3.",
  },
  {
    type: "isomer",
    formula: "fac-[Co(NH3)3Cl3]",
    geometry: "Octahedral",
    note: "Use fac/mer for three identical ligands in octahedral complexes.",
    difficulty: "advanced",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "Cl-",
        left: "NH3",
        right: "Cl-",
        front: "NH3",
        back: "Cl-",
      },
    },
    compare: {
      label: "mer isomer",
      diagram: {
        central: "Co",
        ligands: {
          top: "NH3",
          bottom: "NH3",
          left: "NH3",
          right: "Cl-",
          front: "Cl-",
          back: "Cl-",
        },
      },
    },
    accepted: ["fac-triamminetrichlorocobalt(iii)"],
    rationale: "Facial arrangement; Co is +3.",
  },
  {
    type: "isomer",
    formula: "mer-[Co(NH3)3Cl3]",
    geometry: "Octahedral",
    note: "Use fac/mer for three identical ligands in octahedral complexes.",
    difficulty: "advanced",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "Cl-",
        front: "Cl-",
        back: "Cl-",
      },
    },
    compare: {
      label: "fac isomer",
      diagram: {
        central: "Co",
        ligands: {
          top: "NH3",
          bottom: "Cl-",
          left: "NH3",
          right: "Cl-",
          front: "NH3",
          back: "Cl-",
        },
      },
    },
    accepted: ["mer-triamminetrichlorocobalt(iii)"],
    rationale: "Meridional arrangement; Co is +3.",
  },
  {
    type: "linkage",
    formula: "[Co(NH3)5(NCS)]Cl2",
    geometry: "Octahedral",
    note: "Ambidentate ligand: indicate binding atom with kappa notation.",
    difficulty: "advanced",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "NH3",
        front: "NH3",
        back: "NCS-",
      },
    },
    accepted: ["pentaammine(thiocyanato-kappa-n)cobalt(iii) chloride"],
    rationale: "Thiocyanato bound through N; Co is +3.",
  },
  {
    type: "linkage",
    formula: "[Co(NH3)5(SCN)]Cl2",
    geometry: "Octahedral",
    note: "Ambidentate ligand: indicate binding atom with kappa notation.",
    difficulty: "advanced",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "NH3",
        front: "NH3",
        back: "SCN-",
      },
    },
    accepted: ["pentaammine(thiocyanato-kappa-s)cobalt(iii) chloride"],
    rationale: "Thiocyanato bound through S; Co is +3.",
  },
  {
    type: "chelate",
    formula: "K2[Pt(C2O4)2]",
    geometry: "Square planar",
    note: "Use bis for polydentate ligands; -ate for anionic complexes.",
    difficulty: "advanced",
    diagram: {
      central: "Pt",
      ligands: {
        top: "C2O4",
        bottom: "C2O4",
        left: "C2O4",
        right: "C2O4",
      },
    },
    accepted: ["potassium bis(oxalato)platinate(ii)"],
    rationale: "Complex is 2-; Pt is +2.",
  },
  {
    type: "chelate",
    formula: "[Cr(acac)3]",
    geometry: "Octahedral",
    note: "Polydentate ligands use tris/bis as needed.",
    difficulty: "advanced",
    diagram: {
      central: "Cr",
      ligands: {
        top: "acac",
        bottom: "acac",
        left: "acac",
        right: "acac",
        front: "acac",
        back: "acac",
      },
    },
    accepted: ["tris(acetylacetonato)chromium(iii)"],
    rationale: "Acetylacetonato is monoanionic; Cr is +3.",
  },
  {
    type: "kappa",
    formula: "[Co(NH3)4(gly)]Cl2",
    geometry: "Octahedral",
    note: "Use kappa notation for multidentate ligands.",
    difficulty: "advanced",
    diagram: {
      central: "Co",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "NH3",
        front: "gly",
        back: "gly",
      },
    },
    accepted: ["tetraammine(glycinato-kappa2n,o)cobalt(iii) chloride"],
    rationale: "Glycinato is bidentate N,O; Co is +3.",
  },
  {
    type: "bridging",
    formula: "[Co2(NH3)8(mu-Cl)2]Cl4",
    geometry: "Octahedral",
    note: "Use mu- to denote bridging ligands in polynuclear complexes.",
    difficulty: "advanced",
    diagram: {
      central: "Co2",
      ligands: {
        top: "NH3",
        bottom: "NH3",
        left: "NH3",
        right: "NH3",
        front: "mu-Cl",
        back: "mu-Cl",
      },
    },
    accepted: ["di-mu-chloro-bis(tetraamminecobalt(iii)) chloride"],
    rationale: "Two Co(III) centers bridged by two chloro ligands; 4+ cation.",
  },
  {
    type: "bridging",
    formula: "[Fe2(mu-O)(H2O)8]Cl4",
    geometry: "Octahedral",
    note: "Use mu- for bridging oxo ligands.",
    difficulty: "advanced",
    diagram: {
      central: "Fe2",
      ligands: {
        top: "H2O",
        bottom: "H2O",
        left: "H2O",
        right: "H2O",
        front: "mu-O",
        back: "H2O",
      },
    },
    accepted: ["mu-oxo-bis(tetraaquairon(iii)) chloride"],
    rationale: "Two Fe(III) centers bridged by oxo; 4+ cation.",
  },
];

const ligandTagMap = [
  { token: "NH3", tag: "ammine" },
  { token: "H2O", tag: "aqua" },
  { token: "Cl", tag: "chloro" },
  { token: "CN", tag: "cyano" },
  { token: "CO", tag: "carbonyl" },
  { token: "en", tag: "ethylenediamine" },
  { token: "NO2", tag: "nitro" },
  { token: "ONO", tag: "nitrito" },
  { token: "NCS", tag: "thiocyanato" },
  { token: "SCN", tag: "thiocyanato" },
  { token: "OH", tag: "hydroxo" },
  { token: "C2O4", tag: "oxalato" },
  { token: "acac", tag: "acac" },
  { token: "gly", tag: "glycinato" },
  { token: "mu-", tag: "bridging" },
];

const deriveTags = (question) => {
  const tags = new Set();
  const formula = question.formula || "";
  tags.add(question.type.toLowerCase());
  tags.add(question.geometry.toLowerCase());
  ligandTagMap.forEach(({ token, tag }) => {
    if (formula.includes(token)) {
      tags.add(tag);
    }
  });
  if (formula.includes("cis-") || formula.includes("trans-")) {
    tags.add("isomer");
  }
  return Array.from(tags);
};

questions.forEach((question) => {
  if (!question.difficulty) {
    question.difficulty = "core";
  }
  if (!question.tags) {
    question.tags = deriveTags(question);
  }
});

const state = {
  currentIndex: 0,
  streak: 0,
  correct: 0,
  total: 0,
  used: new Set(),
  adaptiveQueue: [],
  adaptive: true,
  difficulty: "all",
  showLabels: true,
  colorMode: "donor",
  rigorMode: false,
  labelsLocked: false,
};

const questionType = document.getElementById("questionType");
const difficultyBadge = document.getElementById("difficultyBadge");
const questionPrompt = document.getElementById("questionPrompt");
const questionNote = document.getElementById("questionNote");
const geometryHint = document.getElementById("geometryHint");
const diagram = document.getElementById("diagram");
const answerInput = document.getElementById("answerInput");
const feedback = document.getElementById("feedback");
const streak = document.getElementById("streak");
const accuracy = document.getElementById("accuracy");
const questionCount = document.getElementById("questionCount");
const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("submitBtn");
const skipBtn = document.getElementById("skipBtn");
const howBtn = document.getElementById("howBtn");
const howItWorks = document.getElementById("howItWorks");
const adaptiveToggle = document.getElementById("adaptiveToggle");
const difficultyChips = Array.from(document.querySelectorAll(".chip"));
const compareBtn = document.getElementById("compareBtn");
const compareLabel = document.getElementById("compareLabel");
const viewerNote = document.getElementById("viewerNote");
const viewerElement = document.getElementById("viewer3d");
const labelToggle = document.getElementById("labelToggle");
const colorToggle = document.getElementById("colorToggle");
const rigorToggle = document.getElementById("rigorToggle");

const compareState = {
  active: false,
};

let viewer3d = null;

const settingsKey = "coordination-naming-settings";

const normalize = (value) => {
  return value
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/,/g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const saveSettings = () => {
  const payload = {
    adaptive: state.adaptive,
    difficulty: state.difficulty,
    showLabels: state.showLabels,
    colorMode: state.colorMode,
    rigorMode: state.rigorMode,
    labelsLocked: state.labelsLocked,
  };
  localStorage.setItem(settingsKey, JSON.stringify(payload));
};

const loadSettings = () => {
  const raw = localStorage.getItem(settingsKey);
  if (!raw) {
    return;
  }
  try {
    const data = JSON.parse(raw);
    if (typeof data.adaptive === "boolean") {
      state.adaptive = data.adaptive;
    }
    if (typeof data.difficulty === "string") {
      state.difficulty = data.difficulty;
    }
    if (typeof data.showLabels === "boolean") {
      state.showLabels = data.showLabels;
    }
    if (typeof data.colorMode === "string") {
      state.colorMode = data.colorMode;
    }
    if (typeof data.rigorMode === "boolean") {
      state.rigorMode = data.rigorMode;
    }
    if (typeof data.labelsLocked === "boolean") {
      state.labelsLocked = data.labelsLocked;
    }
  } catch (error) {
    localStorage.removeItem(settingsKey);
  }
};

const difficultyLabels = {
  intro: "Intro",
  core: "Core",
  advanced: "Advanced",
  all: "All",
};

const updateDifficultyUI = () => {
  difficultyChips.forEach((chip) => {
    const isActive = chip.dataset.difficulty === state.difficulty;
    chip.classList.toggle("active", isActive);
  });
};

const updateAdaptiveUI = () => {
  adaptiveToggle.textContent = state.adaptive ? "On" : "Off";
  adaptiveToggle.classList.toggle("off", !state.adaptive);
};

const updateRigorUI = () => {
  rigorToggle.textContent = state.rigorMode ? "On" : "Off";
  rigorToggle.classList.toggle("off", !state.rigorMode);
};

const updateLabelToggleUI = () => {
  if (state.labelsLocked) {
    labelToggle.textContent = "Labels locked";
    labelToggle.classList.add("locked");
    labelToggle.classList.remove("active");
    labelToggle.disabled = true;
  } else {
    labelToggle.textContent = "Labels";
    labelToggle.disabled = false;
    labelToggle.classList.remove("locked");
    labelToggle.classList.toggle("active", state.showLabels);
  }
};

const updateColorToggleUI = () => {
  colorToggle.textContent = `Color: ${state.colorMode}`;
};

const applySettingsToUI = () => {
  updateAdaptiveUI();
  updateRigorUI();
  updateDifficultyUI();
  updateLabelToggleUI();
  updateColorToggleUI();
};

const getQuestionPool = () => {
  if (state.difficulty === "all") {
    return questions;
  }
  const pool = questions.filter((question) => question.difficulty === state.difficulty);
  return pool.length ? pool : questions;
};

const getSimilarQuestions = (question) => {
  const pool = getQuestionPool();
  const targetTags = new Set(question.tags);
  const scored = pool
    .filter((candidate) => candidate !== question)
    .map((candidate) => {
      const overlap = candidate.tags.filter((tag) => targetTags.has(tag)).length;
      return { candidate, overlap };
    })
    .filter((item) => item.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap);
  return scored.map((item) => item.candidate);
};

const geometryCoordinates = {
  octahedral: {
    top: [0, 0, 1],
    bottom: [0, 0, -1],
    left: [-1, 0, 0],
    right: [1, 0, 0],
    front: [0, 1, 0],
    back: [0, -1, 0],
  },
  "square planar": {
    top: [0, 1, 0],
    bottom: [0, -1, 0],
    left: [-1, 0, 0],
    right: [1, 0, 0],
  },
  tetrahedral: {
    top: [1, 1, 1],
    bottom: [-1, -1, 1],
    left: [-1, 1, -1],
    right: [1, -1, -1],
  },
  linear: {
    left: [-1, 0, 0],
    right: [1, 0, 0],
  },
  "trigonal bipyramidal": {
    top: [0, 0, 1],
    bottom: [0, 0, -1],
    left: [-1, 0, 0],
    right: [1, 0, 0],
    front: [0, 1, 0],
  },
};

const ligandToElement = (ligand) => {
  if (!ligand) {
    return "C";
  }
  if (ligand.startsWith("mu-Cl")) {
    return "Cl";
  }
  if (ligand.startsWith("mu-O")) {
    return "O";
  }
  if (ligand.startsWith("Cl")) {
    return "Cl";
  }
  if (ligand.startsWith("NH")) {
    return "N";
  }
  if (ligand.startsWith("H2O") || ligand.startsWith("OH")) {
    return "O";
  }
  if (ligand.startsWith("CN")) {
    return "C";
  }
  if (ligand.startsWith("CO")) {
    return "C";
  }
  if (ligand.startsWith("NO")) {
    return "N";
  }
  if (ligand.startsWith("SCN") || ligand.startsWith("NCS")) {
    return "S";
  }
  if (ligand.startsWith("C2O4") || ligand.startsWith("acac") || ligand.startsWith("gly")) {
    return "O";
  }
  return "C";
};

const metalSymbolFromCentral = (central) => {
  const match = central.match(/[A-Z][a-z]?/);
  return match ? match[0] : "M";
};

const buildXYZModel = (question, diagramData) => {
  const geometryKey = question.geometry.toLowerCase();
  const positions = geometryCoordinates[geometryKey];
  if (!positions) {
    return null;
  }
  const atoms = [];
  atoms.push({
    element: metalSymbolFromCentral(question.diagram.central),
    x: 0,
    y: 0,
    z: 0,
    label: question.diagram.central,
    role: "metal",
  });
  const scale = 2.2;
  Object.entries(diagramData.ligands).forEach(([position, label]) => {
    const coord = positions[position];
    if (!coord) {
      return;
    }
    const [x, y, z] = coord.map((value) => value * scale);
    const role = label.includes("-") || label.startsWith("mu-") ? "anionic" : "neutral";
    atoms.push({
      element: ligandToElement(label),
      x,
      y,
      z,
      label,
      role,
    });
  });
  const lines = [
    `${atoms.length}`,
    `${question.formula} idealized geometry`,
    ...atoms.map((atom) => `${atom.element} ${atom.x.toFixed(4)} ${atom.y.toFixed(4)} ${atom.z.toFixed(4)}`),
  ];
  return { xyz: lines.join("\n"), atoms };
};

const elementColorMap = {
  Cl: "#4b6cb7",
  N: "#1f8a8a",
  O: "#d06b28",
  S: "#7a6a5e",
  C: "#6b5c4b",
  M: "#0f3d3e",
};

const chargeColorMap = {
  metal: "#0f3d3e",
  neutral: "#d66b2d",
  anionic: "#2b6cb0",
};

const render3DModel = (question, diagramData) => {
  if (!viewerElement) {
    console.error("3D viewer element not found");
    if (viewerNote) viewerNote.textContent = "3D viewer element not found.";
    return;
  }
  if (typeof $3Dmol === "undefined") {
    console.error("3Dmol library not loaded");
    if (viewerNote) viewerNote.textContent = "3D library loading...";
    // Retry after a delay
    setTimeout(() => render3DModel(question, diagramData), 500);
    return;
  }
  try {
    if (!viewer3d) {
      viewer3d = $3Dmol.createViewer(viewerElement, {
        backgroundColor: "#1e1e2a",
      });
    }
    viewer3d.clear();

    const modelData = buildXYZModel(question, diagramData);
    if (!modelData) {
      viewerNote.textContent = "3D model not available for this geometry.";
      viewer3d.render();
      return;
    }

    viewerNote.textContent = "Idealized 3D geometry model. Rotate and zoom for spatial orientation.";
    viewer3d.addModel(modelData.xyz, "xyz");
    viewer3d.setStyle({}, { stick: { radius: 0.12 }, sphere: { scale: 0.45 } });
    const model = viewer3d.getModel();
    const atoms = model.selectedAtoms({});
    atoms.forEach((atom, index) => {
      const meta = modelData.atoms[index];
      if (!meta) {
        return;
      }
      let color = elementColorMap[meta.element] || elementColorMap.M;
      if (state.colorMode === "charge") {
        color = chargeColorMap[meta.role] || chargeColorMap.neutral;
      }
      const selector = atom.serial ? { serial: atom.serial } : { index };
      viewer3d.setStyle(selector, {
        stick: { radius: 0.12, color },
        sphere: { scale: meta.role === "metal" ? 0.55 : 0.45, color },
      });
      if (state.showLabels) {
        viewer3d.addLabel(meta.label, {
          position: { x: meta.x, y: meta.y, z: meta.z },
          backgroundColor: "rgba(26, 26, 36, 0.9)",
          fontColor: "#e8e6e3",
          fontSize: 11,
          borderColor: "rgba(255,255,255,0.15)",
        });
      }
    });
    viewer3d.zoomTo();
    viewer3d.render();
  } catch (err) {
    console.error("3D viewer error:", err);
    if (viewerNote) viewerNote.textContent = "3D viewer error: " + err.message;
  }
};

const enqueueAdaptiveQuestion = (question) => {
  if (!state.adaptive) {
    return;
  }
  const candidates = getSimilarQuestions(question);
  if (!candidates.length) {
    return;
  }
  const top = candidates.slice(0, 3);
  const pick = top[Math.floor(Math.random() * top.length)];
  if (!state.adaptiveQueue.includes(pick)) {
    state.adaptiveQueue.push(pick);
  }
};

const checkMastery = () => {
  if (!state.rigorMode || state.labelsLocked) {
    return;
  }
  const accuracy = state.total === 0 ? 0 : state.correct / state.total;
  if (state.total >= 12 && accuracy >= 0.8 && state.streak >= 6) {
    state.labelsLocked = true;
    state.showLabels = false;
    updateLabelToggleUI();
    saveSettings();
    const question = questions[state.currentIndex];
    const diagramData = compareState.active && question.compare ? question.compare.diagram : question.diagram;
    render3DModel(question, diagramData);
  }
};

const getRandomQuestion = () => {
  const pool = getQuestionPool();
  if (state.adaptive && state.adaptiveQueue.length > 0) {
    const next = state.adaptiveQueue.shift();
    state.used.add(questions.indexOf(next));
    return next;
  }
  const poolIndexes = pool.map((question) => questions.indexOf(question));
  if (state.used.size >= poolIndexes.length) {
    state.used.clear();
  }
  let index = poolIndexes[Math.floor(Math.random() * poolIndexes.length)];
  while (state.used.has(index)) {
    index = poolIndexes[Math.floor(Math.random() * poolIndexes.length)];
  }
  state.used.add(index);
  return questions[index];
};

const updateDiagram = (data) => {
  diagram.innerHTML = "";
  const central = document.createElement("div");
  central.className = "central";
  central.textContent = data.central;
  diagram.appendChild(central);

  Object.entries(data.ligands).forEach(([position, label]) => {
    const ligand = document.createElement("div");
    ligand.className = `ligand ${position}`;
    ligand.textContent = label;
    diagram.appendChild(ligand);
  });
};

const renderCompareLabel = (question) => {
  if (!question.compare) {
    compareLabel.textContent = "";
    return;
  }
  compareLabel.textContent = compareState.active
    ? `Viewing ${question.compare.label}`
    : "Viewing prompt isomer";
};

const loadQuestion = () => {
  const question = getRandomQuestion();
  state.currentIndex = questions.indexOf(question);
  questionType.textContent = question.type;
  difficultyBadge.textContent = difficultyLabels[question.difficulty] || "Core";
  questionPrompt.textContent = question.formula;
  questionNote.textContent = question.note;
  geometryHint.textContent = question.geometry;
  compareState.active = false;
  if (question.compare) {
    compareBtn.style.display = "inline-flex";
    compareBtn.textContent = "Compare isomer";
  } else {
    compareBtn.style.display = "none";
  }
  renderCompareLabel(question);
  const diagramData = question.compare && compareState.active ? question.compare.diagram : question.diagram;
  updateDiagram(diagramData);
  render3DModel(question, diagramData);
  answerInput.value = "";
  feedback.className = "feedback";
  feedback.textContent = "";
  answerInput.focus();
};

const updateScore = () => {
  streak.textContent = state.streak;
  questionCount.textContent = state.total;
  const percent = state.total === 0 ? 0 : Math.round((state.correct / state.total) * 100);
  accuracy.textContent = `${percent}%`;
};

const renderFeedback = (isCorrect, question) => {
  feedback.className = `feedback ${isCorrect ? "success" : "error"}`;
  if (isCorrect) {
    feedback.textContent = `Correct. ${question.rationale}`;
    return;
  }
  feedback.textContent = `Expected: ${question.accepted[0]}. ${question.rationale}`;
};

const checkAnswer = () => {
  const question = questions[state.currentIndex];
  const userAnswer = normalize(answerInput.value);
  if (!userAnswer) {
    return;
  }
  const isCorrect = question.accepted.some(
    (answer) => normalize(answer) === userAnswer
  );

  state.total += 1;
  if (isCorrect) {
    state.correct += 1;
    state.streak += 1;
    checkMastery();
  } else {
    state.streak = 0;
    enqueueAdaptiveQuestion(question);
  }
  renderFeedback(isCorrect, question);
  updateScore();
  setTimeout(loadQuestion, 1200);
};

const skipQuestion = () => {
  state.total += 1;
  state.streak = 0;
  updateScore();
  loadQuestion();
};

startBtn.addEventListener("click", () => {
  state.streak = 0;
  state.correct = 0;
  state.total = 0;
  state.used.clear();
  updateScore();
  loadQuestion();
});

submitBtn.addEventListener("click", checkAnswer);
answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

skipBtn.addEventListener("click", skipQuestion);

howBtn.addEventListener("click", () => {
  howItWorks.scrollIntoView({ behavior: "smooth" });
});

adaptiveToggle.addEventListener("click", () => {
  state.adaptive = !state.adaptive;
  updateAdaptiveUI();
  if (!state.adaptive) {
    state.adaptiveQueue = [];
  }
  saveSettings();
});

difficultyChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    state.difficulty = chip.dataset.difficulty || "all";
    updateDifficultyUI();
    state.used.clear();
    state.adaptiveQueue = [];
    loadQuestion();
    saveSettings();
  });
});

compareBtn.addEventListener("click", () => {
  const question = questions[state.currentIndex];
  if (!question || !question.compare) {
    return;
  }
  compareState.active = !compareState.active;
  const diagramData = compareState.active ? question.compare.diagram : question.diagram;
  updateDiagram(diagramData);
  renderCompareLabel(question);
  render3DModel(question, diagramData);
});

labelToggle.addEventListener("click", () => {
  if (state.labelsLocked) {
    return;
  }
  state.showLabels = !state.showLabels;
  updateLabelToggleUI();
  const question = questions[state.currentIndex];
  const diagramData = compareState.active && question.compare ? question.compare.diagram : question.diagram;
  render3DModel(question, diagramData);
  saveSettings();
});

colorToggle.addEventListener("click", () => {
  state.colorMode = state.colorMode === "donor" ? "charge" : "donor";
  updateColorToggleUI();
  const question = questions[state.currentIndex];
  const diagramData = compareState.active && question.compare ? question.compare.diagram : question.diagram;
  render3DModel(question, diagramData);
  saveSettings();
});

rigorToggle.addEventListener("click", () => {
  state.rigorMode = !state.rigorMode;
  updateRigorUI();
  if (!state.rigorMode) {
    state.labelsLocked = false;
    updateLabelToggleUI();
  } else {
    checkMastery();
  }
  saveSettings();
});

loadSettings();
if (state.labelsLocked) {
  state.showLabels = false;
}
applySettingsToUI();
loadQuestion();
updateScore();
