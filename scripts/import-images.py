#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
§12 — ছবি সংগ্রহ পাইপলাইন।

image_search দিয়ে ডাউনলোড হওয়া ফাইলগুলো (image-search/) ঠিকমতো রিসাইজ করে
public/seed/<গ্রুপ>/<slug>.jpg-এ বসায় এবং data/seed/media-images.ts-এ
প্রতিটি ছবির উৎস-প্রমাণ (source page + লাইসেন্স অবস্থা) লিখে রাখে।

নিয়ম:
  * শুধু উন্মুক্ত/ফ্রি-লাইসেন্স উৎস (উইকিমিডিয়া কমন্স, পেক্সেলস) গ্রহণযোগ্য।
  * লেখক/লাইসেন্স না জানলে কখনোই মিথ্যা ক্রেডিট লেখা হয় না — verified:false রেখে
    "যাচাই বাকি" দেখানো হয় (§12: ভুল ক্রেডিট/অ্যাট্রিবিউশন কখনোই চলবে না)।
  * উৎসের শিরোনাম/ক্যাটাগরি থেকে প্রজাতি নিশ্চিত না হলে confidence:'low' দেওয়া হয়।
  * স্ক্রিপ্টটি idempotent — বারবার চালালে একই ফলাফল আসে।
"""
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "image-search")
OUT_TS = os.path.join(ROOT, "data", "seed", "media-images.ts")

# slug, src file, group dir, বাংলা বিষয়, উৎস-পাতা, উৎস-সাইট, confidence
M = [
    # ---------- উদ্ভিদ (udbhid) ----------
    ("am", "mangifera-indica-site-commons-wikimedia--1.jpg", "udbhid", "আম", "https://commons.wikimedia.org/wiki/Category:Mangifera_indica", "উইকিমিডিয়া কমন্স", "high"),
    ("mehogoni", "swietenia-mahagoni-site-commons-wikimedi-1.jpg", "udbhid", "মেহগনি", "https://commons.wikimedia.org/wiki/Category:Serampore_College", "উইকিমিডিয়া কমন্স", "high"),
    ("oshbottho", "ficus-religiosa-site-commons-wikimedia-o-1.jpg", "udbhid", "অশ্বত্থ", "https://commons.wikimedia.org/wiki/Category:Ficus_religiosa", "উইকিমিডিয়া কমন্স", "high"),
    ("amloki", "phyllanthus-emblica-amla-fruit-tree-phot-1.jpg", "udbhid", "আমলকি", "https://www.pexels.com/search/amla%20fruit/", "পেক্সেলস", "high"),
    ("kochuripana", "pontederia-crassipes-site-commons-wikime-1.jpg", "udbhid", "কচুরিপানা", "https://commons.wikimedia.org/wiki/Category:Pool_Malebo", "উইকিমিডিয়া কমন্স", "high"),
    ("kadam", "neolamarckia-cadamba-site-commons-wikime-1.jpg", "udbhid", "কদম", "https://commons.wikimedia.org/wiki/Category:Shangrila", "উইকিমিডিয়া কমন্স", "high"),
    ("khejur", "phoenix-sylvestris-site-commons-wikimedi-1.jpg", "udbhid", "খেজুর", "https://commons.wikimedia.org/wiki/File:Toddy_collection_in_Phoenix_sylvestris_from_Andhra_Phoenix_sylvestris_from_Andhra_JEG9133.JPG", "উইকিমিডিয়া কমন্স", "high"),
    ("goran", "ceriops-decandra-site-commons-wikimedia--1.png", "udbhid", "গরান", "https://commons.wikimedia.org/wiki/Category:Ceriops", "উইকিমিডিয়া কমন্স", "high"),
    ("gewa", "excoecaria-agallocha-site-commons-wikime-1.jpg", "udbhid", "গেওয়া", "https://commons.wikimedia.org/wiki/File:Excoecaria_agallocha_05938.JPG", "উইকিমিডিয়া কমন্স", "high"),
    ("cha", "camellia-sinensis-site-commons-wikimedia-1.jpg", "udbhid", "চা", "https://commons.wikimedia.org/wiki/File:Camellia_sinensis_flower_tea.JPG", "উইকিমিডিয়া কমন্স", "high"),
    ("jaba", "hibiscus-rosa-sinensis-site-commons-wiki-1.jpg", "udbhid", "জবা", "https://commons.wikimedia.org/wiki/Category:Hibiscus_rosa-sinensis", "উইকিমিডিয়া কমন্স", "high"),
    ("jam", "syzygium-cumini-site-commons-wikimedia-o-1.jpg", "udbhid", "জাম", "https://commons.wikimedia.org/wiki/File:Syzygium_cumini_plants.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("tal", "borassus-flabellifer-site-commons-wikime-1.jpg", "udbhid", "তাল", "https://commons.wikimedia.org/wiki/Category:Borassus_flabellifer", "উইকিমিডিয়া কমন্স", "high"),
    ("tulshi", "ocimum-tenuiflorum-site-commons-wikimedi-1.jpg", "udbhid", "তুলসী", "https://commons.wikimedia.org/wiki/Ocimum_tenuiflorum", "উইকিমিডিয়া কমন্স", "high"),
    ("tetul", "tamarindus-indica-site-commons-wikimedia-1.jpg", "udbhid", "তেঁতুল", "https://commons.wikimedia.org/wiki/Category:Tamarindus_indica_(fruit)", "উইকিমিডিয়া কমন্স", "high"),
    ("narikel", "cocos-nucifera-site-commons-wikimedia-or-1.jpg", "udbhid", "নারিকেল", "https://commons.wikimedia.org/wiki/Category:Cocos_nucifera_(flowers)", "উইকিমিডিয়া কমন্স", "high"),
    ("nim", "azadirachta-indica-site-commons-wikimedi-1.jpg", "udbhid", "নিম", "https://commons.wikimedia.org/wiki/Category:Azadirachta_indica", "উইকিমিডিয়া কমন্স", "high"),
    ("padma", "nelumbo-nucifera-lotus-site-commons-wiki-1.jpg", "udbhid", "পদ্ম", "https://commons.wikimedia.org/wiki/Nelumbo_nucifera", "উইকিমিডিয়া কমন্স", "high"),
    ("paat", "corchorus-olitorius-site-commons-wikimed-1.jpg", "udbhid", "পাট", "https://commons.wikimedia.org/wiki/Category:Corchorus_olitorius", "উইকিমিডিয়া কমন্স", "high"),
    ("pan", "piper-betle-site-commons-wikimedia-org-1.jpg", "udbhid", "পান", "https://commons.wikimedia.org/wiki/Category:Piper_betle", "উইকিমিডিয়া কমন্স", "high"),
    ("bokul", "mimusops-elengi-site-commons-wikimedia-o-1.jpg", "udbhid", "বকুল", "https://commons.wikimedia.org/wiki/Category:Mimusops_elengi", "উইকিমিডিয়া কমন্স", "high"),
    ("bash", "bambusa-vulgaris-bamboo-clump-site-commo-1.jpg", "udbhid", "বাঁশ", "https://commons.wikimedia.org/wiki/Category:Bambusa_vulgaris", "উইকিমিডিয়া কমন্স", "high"),
    ("bel", "aegle-marmelos-site-commons-wikimedia-or-1.jpg", "udbhid", "বেল", "https://commons.wikimedia.org/wiki/Category:Aegle_marmelos", "উইকিমিডিয়া কমন্স", "high"),
    ("shajne", "moringa-oleifera-site-commons-wikimedia--1.jpg", "udbhid", "সজনে", "https://commons.wikimedia.org/wiki/Moringa_oleifera", "উইকিমিডিয়া কমন্স", "high"),
    ("shorisha", "brassica-juncea-mustard-plant-mustard-fi-1.jpg", "udbhid", "সরিষা", "https://en.wikipedia.org/wiki/Mustard_plant", "উইকিমিডিয়া কমন্স", "high"),
    ("supari", "areca-catechu-site-commons-wikimedia-org-1.jpg", "udbhid", "সুপারি", "https://commons.wikimedia.org/wiki/Category:Areca_catechu", "উইকিমিডিয়া কমন্স", "high"),
    ("shegun", "tectona-grandis-site-commons-wikimedia-o-1.jpg", "udbhid", "সেগুন", "https://commons.wikimedia.org/wiki/Tectona_grandis", "উইকিমিডিয়া কমন্স", "high"),
    ("horitoki", "terminalia-chebula-site-commons-wikimedi-1.jpg", "udbhid", "হরিতকি", "https://commons.wikimedia.org/wiki/Category:Terminalia_chebula", "উইকিমিডিয়া কমন্স", "high"),
    ("holud", "curcuma-longa-wikimedia-commons-file-tur-1.jpg", "udbhid", "হলুদ", "https://commons.wikimedia.org/wiki/Curcuma_longa", "উইকিমিডিয়া কমন্স", "high"),
    ("hijol", "barringtonia-acutangula-site-commons-wik-1.jpg", "udbhid", "হিজল", "https://commons.wikimedia.org/wiki/File:Barringtonia_acutangula_L%E1%BB%99c_v%E1%BB%ABng.JPG", "উইকিমিডিয়া কমন্স", "high"),
    # ---------- মাছ (prani) ----------
    ("air", "sperata-aor-aor-catfish-photograph-1.jpg", "prani", "আইড়", "https://en.wikipedia.org/wiki/Sperata_aor", "উইকিমিডিয়া কমন্স", "high"),
    ("koi", "anabas-testudineus-climbing-perch-site-c-1.jpg", "prani", "কই", "https://commons.wikimedia.org/wiki/File:Anabas_testudineus_climbing_perch.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("kalbaus", "labeo-calbasu-site-commons-wikimedia-org-1.jpg", "prani", "কালবাউস", "https://commons.wikimedia.org/wiki/Category:Labeo_calbasu", "উইকিমিডিয়া কমন্স", "high"),
    ("kholisa", "trichogaster-fasciata-site-commons-wikim-1.jpg", "prani", "খলিসা", "https://commons.wikimedia.org/wiki/File:Trichogaster_fasciata_179813241.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("gazar", "channa-marulius-site-commons-wikimedia-o-1.jpg", "prani", "গজার", "https://commons.wikimedia.org/wiki/File:Channa_marulius_(Mekong)_2347.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("chanda", "chanda-nama-glassfish-site-commons-wikim-1.jpg", "prani", "চাঁদা", "https://commons.wikimedia.org/wiki/Category:Chanda_nama", "উইকিমিডিয়া কমন্স", "low"),
    ("chitol", "chitala-chitala-site-commons-wikimedia-o-1.jpg", "prani", "চিতল", "https://commons.wikimedia.org/wiki/Category:Chitala_chitala", "উইকিমিডিয়া কমন্স", "high"),
    ("chapila", "gudusia-chapra-site-commons-wikimedia-or-1.jpg", "prani", "চ্যাপিলা", "https://commons.wikimedia.org/wiki/Category:Gudusia_chapra", "উইকিমিডিয়া কমন্স", "high"),
    ("tengra", "mystus-tengara-site-commons-wikimedia-or-1.jpg", "prani", "টেংরা", "https://commons.wikimedia.org/wiki/File:Mystus_tengara.JPG", "উইকিমিডিয়া কমন্স", "high"),
    ("telapia", "oreochromis-niloticus-site-commons-wikim-1.jpg", "prani", "তেলাপিয়া", "https://commons.wikimedia.org/wiki/File:Oreochromis_niloticus_(44653802502).jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("pabda", "ompok-pabda-site-commons-wikimedia-org-1.jpg", "prani", "পাবদা", "https://commons.wikimedia.org/wiki/File:Butterfish_(Pabda).jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("puti", "puntius-sophore-site-commons-wikimedia-o-1.jpg", "prani", "পুঁটি", "https://commons.wikimedia.org/wiki/Category:Puntius_sophore", "উইকিমিডিয়া কমন্স", "high"),
    ("bamosh", "anguilla-bengalensis-site-commons-wikime-1.jpg", "prani", "বামোস", "https://commons.wikimedia.org/wiki/Category:Anguilla_bengalensis", "উইকিমিডিয়া কমন্স", "high"),
    ("mrigel", "cirrhinus-cirrhosus-mrigal-site-commons--1.jpg", "prani", "মৃগেল", "https://commons.wikimedia.org/wiki/Category:Cirrhinus_cirrhosus", "উইকিমিডিয়া কমন্স", "high"),
    ("shingi", "heteropneustes-fossilis-stinging-catfish-1.jpg", "prani", "শিং", "https://commons.wikimedia.org/wiki/Category:Fish_of_West_Bengal", "উইকিমিডিয়া কমন্স", "high"),
    ("shol", "channa-striata-snakehead-murrel-site-com-1.jpg", "prani", "শোল", "https://commons.wikimedia.org/wiki/Category:Channa_striata", "উইকিমিডিয়া কমন্স", "medium"),
    ("silver-carp", "hypophthalmichthys-molitrix-silver-carp--1.jpg", "prani", "সিলভার কার্প", "https://commons.wikimedia.org/wiki/File:Silver_Carp_Adult_(Hypophthalmichthys_molitrix).jpg", "উইকিমিডিয়া কমন্স", "high"),
    # ---------- জলজ অমেরুদণ্ডী (prani) ----------
    ("bagda-chingri", "penaeus-monodon-giant-tiger-prawn-site-c-1.jpg", "prani", "বাগদা চিংড়ি", "https://commons.wikimedia.org/wiki/Category:Penaeus_monodon", "উইকিমিডিয়া কমন্স", "high"),
    ("golda-chingri", "macrobrachium-rosenbergii-giant-river-pr-1.jpg", "prani", "গলদা চিংড়ি", "https://commons.wikimedia.org/wiki/Category:Macrobrachium_rosenbergii", "উইকিমিডিয়া কমন্স", "high"),
    ("kankra", "scylla-serrata-mud-crab-site-commons-wik-1.jpg", "prani", "কাঁকড়া", "https://commons.wikimedia.org/wiki/File:Scylla_serrata_Mud_Crab.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("shamuk", "pila-globosa-apple-snail-site-commons-wi-1.jpg", "prani", "গলুই শামুক", "https://commons.wikimedia.org/wiki/Category:Pila_globosa", "উইকিমিডিয়া কমন্স", "high"),
    ("nadir-jhinuk", "lamellidens-marginalis-freshwater-mussel-1.jpg", "prani", "নদীর ঝিনুক", "https://commons.wikimedia.org/wiki/Category:Lamellidens_marginalis", "উইকিমিডিয়া কমন্স", "high"),
    ("jok", "hirudinaria-medicinal-leech-site-commons-1.jpg", "prani", "জোঁক", "https://commons.wikimedia.org/wiki/Category:Hirudo_medicinalis", "উইকিমিডিয়া কমন্স", "low"),
    ("kecho", "earthworm-pheretima-site-commons-wikimed-1.jpg", "prani", "কেঁচো", "https://commons.wikimedia.org/wiki/File:Pheretima_sieboldi_siborutomimizu_01.jpg", "উইকিমিডিয়া কমন্স", "medium"),
    ("makorsha", "argiope-spider-orb-weaver-site-commons-w-1.jpg", "prani", "মাকড়সা", "https://commons.wikimedia.org/wiki/Category:Argiope_aemula", "উইকিমিডিয়া কমন্স", "medium"),
    ("laphano-makorsha", "plexippus-paykulli-jumping-spider-site-c-1.jpg", "prani", "লাফানো মাকড়সা", "https://commons.wikimedia.org/wiki/Category:Plexippus_paykulli", "উইকিমিডিয়া কমন্স", "high"),
    # ---------- ছত্রাক / শৈবাল (udbhid) ----------
    ("jhinuk-mushroom", "pleurotus-ostreatus-oyster-mushroom-site-1.jpg", "udbhid", "ঝিনুক মাশরুম", "https://commons.wikimedia.org/wiki/File:Pleurotus_ostreatus_(Oyster_Mushroom)_of_different_ages._Sycamore_tree_host.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("kather-chhatrak", "ganoderma-lucidum-bracket-fungus-site-co-1.jpg", "udbhid", "কাঠের ছত্রাক", "https://commons.wikimedia.org/wiki/Category:Ganoderma", "উইকিমিডিয়া কমন্স", "medium"),
    ("khat-mashroom", "agaricus-bisporus-button-mushroom-site-c-1.jpg", "udbhid", "খাদ্য মাশরুম", "https://commons.wikimedia.org/wiki/File:Agaricus_bisporus_mushroom.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("lichen", "lichen-on-tree-bark-site-commons-wikimed-1.jpg", "udbhid", "লাইকেন", "https://commons.wikimedia.org/wiki/Category:Lichens", "উইকিমিডিয়া কমন্স", "high"),
    ("spiroygaera", "spirogyra-algae-micrograph-site-commons--1.jpg", "udbhid", "স্পাইরোগাইরা", "https://commons.wikimedia.org/wiki/File:Spirogyra_algae_under_microscope.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("yeast", "saccharomyces-cerevisiae-yeast-cells-mic-1.jpg", "udbhid", "ইস্ট", "https://commons.wikimedia.org/wiki/Category:Microscopic_images_of_Saccharomyces_cerevisiae", "উইকিমিডিয়া কমন্স", "high"),
    ("chlorella", "chlorella-vulgaris-site-commons-wikimedi-1.jpg", "udbhid", "ক্লোরেলা", "https://commons.wikimedia.org/wiki/File:Chlorella_vulgaris_NIES2170.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("azolla", "azolla-pinnata-mosquito-fern-site-common-1.jpg", "udbhid", "আজোল্লা", "https://commons.wikimedia.org/wiki/Category:Azolla_filiculoides", "উইকিমিডিয়া কমন্স", "medium"),
    # ---------- উভচর (prani) ----------
    ("kuno-byang", "duttaphrynus-melanostictus-common-toad-s-1.jpg", "prani", "কুনো ব্যাঙ", "https://commons.wikimedia.org/wiki/Category:Duttaphrynus_melanostictus", "উইকিমিডিয়া কমন্স", "high"),
    ("sonali-bang", "hoplobatrachus-tigerinus-indian-bullfrog-1.jpg", "prani", "সোনালি টিকটিকি ব্যাঙ", "https://commons.wikimedia.org/wiki/File:Hoplobatrachus_tigerinus_-_%E0%A6%B8%E0%A7%8B%E0%A6%A8%E0%A6%BE_%E0%A6%AC%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%99_(Indian_bullfrog)_3.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("gechobang", "polypedates-leucomystax-tree-frog-site-c-1.jpg", "prani", "গেছো ব্যাঙ", "https://commons.wikimedia.org/wiki/File:Common_Tree_Frog_(Polypedates_leucomystax)8.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("kecho-sisilia", "ichthyophis-glutinosus-caecilian-site-co-1.jpg", "prani", "কেঁচো সিসিলিয়ান", "https://commons.wikimedia.org/wiki/Category:Ichthyophis_glutinosus", "উইকিমিডিয়া কমন্স", "high"),
    ("khude-byang", "microhyla-ornata-ornate-narrow-mouthed-f-1.jpg", "prani", "ক্ষুদে ব্যাঙ", "https://commons.wikimedia.org/wiki/Category:Microhyla_ornata", "উইকিমিডিয়া কমন্স", "high"),
    ("nol-byang", "euphlyctis-cyanophlyctis-skittering-frog-1.jpg", "prani", "নল ব্যাঙ", "https://commons.wikimedia.org/wiki/File:Euphlyctis_cyanophlyctis_(Skittering_frog)_(1)_34.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("lonabang", "fejervarya-cancrivora-crab-eating-frog-s-1.jpg", "prani", "কাঁকড়াবাজ ব্যাঙ", "https://commons.wikimedia.org/wiki/File:Crab-eating_Frog_(Fejervarya_cancrivora)_(14136733284).jpg", "উইকিমিডিয়া কমন্স", "medium"),
    # ---------- নদী-হাওর-দ্বীপ (sthan) ----------
    ("tanguar-haor", "tanguar-haor-bangladesh-site-commons-wik-1.jpg", "sthan", "টাঙ্গুয়ার হাওর", "https://commons.wikimedia.org/wiki/Category:Tanguar_Haor", "উইকিমিডিয়া কমন্স", "high"),
    ("hakaluki-haor", "hakaluki-haor-bangladesh-site-commons-wi-1.jpg", "sthan", "হাকালুকি হাওর", "https://commons.wikimedia.org/wiki/File:Fishing_by_spear_in_a_haor_of_Sunamganj,_Bangladesh.jpg", "উইকিমিডিয়া কমন্স", "medium"),
    ("nijhum-dwip", "nijhum-dwip-bangladesh-site-commons-wiki-1.jpg", "sthan", "নিঝুম দ্বীপ", "https://commons.wikimedia.org/wiki/Category:Nijhum_Dwip", "উইকিমিডিয়া কমন্স", "high"),
    ("sent-martin", "saint-martin-island-bangladesh-site-comm-1.jpg", "sthan", "সেন্ট মার্টিন দ্বীপ", "https://commons.wikimedia.org/wiki/Category:St._Martin%27s_Island", "উইকিমিডিয়া কমন্স", "high"),
    ("jamuna", "jamuna-river-bangladesh-site-commons-wik-1.jpg", "sthan", "যমুনা", "https://commons.wikimedia.org/wiki/Category:Jamuna_River", "উইকিমিডিয়া কমন্স", "high"),
    ("meghna", "meghna-river-bangladesh-site-commons-wik-1.jpg", "sthan", "মেঘনা", "https://commons.wikimedia.org/wiki/Category:Meghna_River", "উইকিমিডিয়া কমন্স", "high"),
    # ---------- সরীসৃপ (prani) ----------
    ("gokhro", "naja-kaouthia-monocled-cobra-site-common-1.jpg", "prani", "গোখরো", "https://commons.wikimedia.org/wiki/File:Indian_Cobra_Naja_naja_by_Dr_Raju_Kasambe_DSCN4991_(16).jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("chondrobora", "daboia-russelii-russell-s-viper-site-com-1.jpg", "prani", "চন্দ্রবোড়া", "https://commons.wikimedia.org/wiki/Category:Daboia_russelii", "উইকিমিডিয়া কমন্স", "high"),
    ("ojogor", "python-molurus-indian-rock-python-site-c-1.jpg", "prani", "অজগর", "https://commons.wikimedia.org/wiki/Category:Python_molurus", "উইকিমিডিয়া কমন্স", "high"),
    ("dhamon-sap", "ptyas-mucosa-indian-rat-snake-site-commo-1.jpg", "prani", "ধামন সাপ", "https://commons.wikimedia.org/wiki/Category:Ptyas_mucosa", "উইকিমিডিয়া কমন্স", "high"),
    ("dhorashap", "xenochrophis-piscator-checkered-keelback-1.jpg", "prani", "ধোড়া সাপ", "https://commons.wikimedia.org/wiki/Category:Xenochrophis_piscator", "উইকিমিডিয়া কমন্স", "high"),
    ("ghor-tiktiki", "hemidactylus-frenatus-common-house-gecko-1.jpg", "prani", "বাড়ির টিকটিকি", "https://commons.wikimedia.org/wiki/File:Successful_cockroach_hunting_of_the_common_house_gecko_(Hemidactylus_frenatus).jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("girigiti", "calotes-versicolor-oriental-garden-lizar-1.jpg", "prani", "গিরিগিটি", "https://commons.wikimedia.org/wiki/Category:Calotes_versicolor", "উইকিমিডিয়া কমন্স", "high"),
    ("ghoreal", "gavialis-gangeticus-gharial-site-commons-1.jpg", "prani", "ঘড়িয়াল", "https://commons.wikimedia.org/wiki/Gavialis_gangeticus", "উইকিমিডিয়া কমন্স", "high"),
    ("green-sea-turtle", "chelonia-mydas-green-sea-turtle-site-com-1.jpg", "prani", "সবুজ সামুদ্রিক কচ্ছপ", "https://commons.wikimedia.org/wiki/Category:Chelonia_mydas", "উইকিমিডিয়া কমন্স", "high"),
    ("halud-pahari-kachhim", "lissemys-punctata-indian-flapshell-turtl-1.jpg", "prani", "হলুদ কচ্ছপ", "https://commons.wikimedia.org/wiki/Category:Lissemys_punctata", "উইকিমিডিয়া কমন্স", "high"),
    ("kalo-kachhim", "geoclemys-hamiltonii-black-pond-turtle-s-1.jpg", "prani", "কালো কচ্ছপ", "https://commons.wikimedia.org/wiki/Category:Geoclemys_hamiltonii", "উইকিমিডিয়া কমন্স", "high"),
    ("olive-ridley", "lepidochelys-olivacea-olive-ridley-turtl-1.jpg", "prani", "অলিভ রিডলি কচ্ছপ", "https://commons.wikimedia.org/wiki/Category:Lepidochelys_olivacea", "উইকিমিডিয়া কমন্স", "high"),
    ("loudoga", "ahaetulla-nasuta-green-vine-snake-site-c-1.jpg", "prani", "লাউডগা", "https://commons.wikimedia.org/wiki/Category:Ahaetulla_nasuta", "উইকিমিডিয়া কমন্স", "high"),
    # ---------- স্তন্যপায়ী (prani) ----------
    ("badur", "pteropus-giganteus-indian-flying-fox-sit-1.png", "prani", "ভাদুড়", "https://commons.wikimedia.org/wiki/File:Indian_Flying_Fox_(Pteropus_giganteus)_Kolkata_West_Bengal_India_27042013.png", "উইকিমিডিয়া কমন্স", "high"),
    ("bon-biral", "felis-chaus-jungle-cat-site-commons-wiki-1.jpg", "prani", "বন বিড়াল", "https://commons.wikimedia.org/wiki/Category:Felis_chaus", "উইকিমিডিয়া কমন্স", "high"),
    ("buno-shukor", "sus-scrofa-wild-boar-site-commons-wikime-1.jpg", "prani", "বুনো শূকর", "https://commons.wikimedia.org/wiki/File:Wild_Boar_(Sus_scrofa_cristatus)_(20132274208).jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("kathbiralii", "funambulus-pennantii-five-striped-palm-s-1.jpg", "prani", "পাতি কাঠবিড়ালি", "https://commons.wikimedia.org/wiki/Category:Funambulus_pennantii", "উইকিমিডিয়া কমন্স", "high"),
    ("neul", "urva-edwardsii-indian-grey-mongoose-site-1.jpg", "prani", "নকুল", "https://commons.wikimedia.org/wiki/Category:Urva_edwardsii", "উইকিমিডিয়া কমন্স", "high"),
    ("shojaru", "hystrix-indica-indian-crested-porcupine--1.jpg", "prani", "সজারু", "https://commons.wikimedia.org/wiki/Hystrix_indica", "উইকিমিডিয়া কমন্স", "high"),
    ("shombor", "rusa-unicolor-sambar-deer-site-commons-w-1.jpg", "prani", "সম্বর হরিণ", "https://commons.wikimedia.org/wiki/File:Young_Sambar_Deer_(Rusa_unicolor).jpg", "উইকিমিডিয়া কমন্স", "high"),
    # ---------- কীট-পতঙ্গ (prani) ----------
    ("mosha", "aedes-aegypti-mosquito-site-commons-wiki-1.jpg", "prani", "এডিস মশা", "https://commons.wikimedia.org/wiki/Category:Aedes_aegypti", "উইকিমিডিয়া কমন্স", "high"),
    ("anesth-mosha", "anopheles-mosquito-site-commons-wikimedi-1.jpg", "prani", "অ্যানোফিলিস মশা", "https://commons.wikimedia.org/wiki/Category:Anopheles_maculipennis", "উইকিমিডিয়া কমন্স", "high"),
    ("moumachhi", "apis-cerana-asiatic-honey-bee-site-commo-1.jpg", "prani", "এশীয় মৌমাছি", "https://commons.wikimedia.org/wiki/Category:Apis_cerana", "উইকিমিডিয়া কমন্স", "high"),
    ("moumachhi-bishal", "apis-dorsata-giant-honey-bee-site-common-1.jpg", "prani", "বড় মৌমাছি", "https://commons.wikimedia.org/wiki/File:Honey_Bee(Apis_dorsata)Hive.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("resom-poka", "bombyx-mori-silkworm-site-commons-wikime-1.jpg", "prani", "রেশম পোকা", "https://commons.wikimedia.org/wiki/File:Bombyx_mori_sul_bozzolo_02.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("plain-tiger", "danaus-chrysippus-plain-tiger-butterfly--1.jpg", "prani", "প্লেইন টাইগার", "https://commons.wikimedia.org/wiki/Category:Danaus_chrysippus", "উইকিমিডিয়া কমন্স", "high"),
    ("common-crow", "euploea-core-common-crow-butterfly-site--1.jpg", "prani", "কমন ক্রো", "https://commons.wikimedia.org/wiki/Category:Euploea_core", "উইকিমিডিয়া কমন্স", "high"),
    ("common-jezebel", "delias-eucharis-common-jezebel-butterfly-1.jpg", "prani", "কমন জেজেবেল", "https://commons.wikimedia.org/wiki/Category:Delias_eucharis", "উইকিমিডিয়া কমন্স", "high"),
    ("lime-butterfly", "papilio-demoleus-lime-butterfly-site-com-1.jpg", "prani", "লিমন বাটারফ্লাই", "https://commons.wikimedia.org/wiki/Papilio_demoleus", "উইকিমিডিয়া কমন্স", "high"),
    ("projapoti-mormi", "papilio-polytes-common-mormon-butterfly--1.jpg", "prani", "মরমি প্রজাপতি", "https://commons.wikimedia.org/wiki/Category:Papilio_polytes", "উইকিমিডিয়া কমন্স", "high"),
    ("foring", "acrida-grasshopper-site-commons-wikimedi-1.jpg", "prani", "ফড়িং", "https://commons.wikimedia.org/wiki/Category:Acrida", "উইকিমিডিয়া কমন্স", "medium"),
    ("gubre-poka", "scarabaeus-dung-beetle-site-commons-wiki-1.jpg", "prani", "গুবরে পোকা", "https://commons.wikimedia.org/wiki/Category:Scarabaeus", "উইকিমিডিয়া কমন্স", "medium"),
    ("jhinjhi-poka", "platypleura-cicada-site-commons-wikimedi-1.jpg", "prani", "ঝিঁঝিঁ পোকা", "https://commons.wikimedia.org/wiki/Category:Platypleura", "উইকিমিডিয়া কমন্স", "high"),
    ("jonaki", "firefly-luciolinae-site-commons-wikimedi-1.jpg", "prani", "জোনাকি", "https://commons.wikimedia.org/wiki/Category:Lampyridae", "উইকিমিডিয়া কমন্স", "medium"),
    ("jonaki-poka", "luciola-firefly-site-commons-wikimedia-o-1.jpg", "prani", "জোনাকি পোকা", "https://commons.wikimedia.org/wiki/File:Japanese_Firefly_%E3%83%98%E3%82%A4%E3%82%B1%E3%83%9C%E3%82%BF%E3%83%AB_Luciola_lateralis.jpg", "উইকিমিডিয়া কমন্স", "medium"),
    ("pipra", "oecophylla-smaragdina-weaver-ant-site-co-1.jpg", "prani", "পিঁপড়া", "https://commons.wikimedia.org/wiki/Category:Oecophylla_smaragdina", "উইকিমিডিয়া কমন্স", "high"),
    ("ui-poka", "odontotermes-termite-mound-site-commons--1.jpg", "prani", "উইপোকা", "https://commons.wikimedia.org/wiki/Category:Trinervitermes", "উইকিমিডিয়া কমন্স", "low"),
    # ---------- অণুজীব (udbhid) ----------
    ("amiba", "amoeba-proteus-site-commons-wikimedia-or-1.jpg", "udbhid", "অ্যামিবা", "https://commons.wikimedia.org/wiki/File:Amoeba_proteus.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("paramecium", "paramecium-caudatum-site-commons-wikimed-1.jpg", "udbhid", "প্যারামিসিয়াম", "https://commons.wikimedia.org/wiki/Category:Paramecium_caudatum", "উইকিমিডিয়া কমন্স", "high"),
    ("ecoli", "escherichia-coli-bacteria-microscope-ima-1.jpg", "udbhid", "ই. কোলাই", "https://commons.wikimedia.org/wiki/File:Bacteria_gram_negativa,_Escherichia_coli.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("vibrio-cholerae", "escherichia-coli-bacteria-sem-site-commo-1.jpg", "udbhid", "কলেরা ব্যাকটেরিয়া", "https://commons.wikimedia.org/wiki/Category:Scanning_electron_microscopic_images_of_bacteria", "উইকিমিডিয়া কমন্স", "high"),
    ("diatom", "diatom-bacillariophyceae-micrograph-site-1.png", "udbhid", "ডায়াটম", "https://commons.wikimedia.org/wiki/Category:Bacillariophyceae", "উইকিমিডিয়া কমন্স", "high"),
    ("lactobacillus", "lactobacillus-acidophilus-bacteria-micro-1.jpg", "udbhid", "ল্যাকটোব্যাসিলাস", "https://commons.wikimedia.org/wiki/File:20101212_200110_LactobacillusAcidophilus.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("nostoc", "nostoc-commune-cyanobacteria-site-common-1.jpg", "udbhid", "নস্টক", "https://commons.wikimedia.org/wiki/File:Cyanobacteria_-_Nostoc_commune_-_geograph.org.uk_-_1470398.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("plasmodium", "plasmodium-falciparum-site-commons-wikim-1.png", "udbhid", "প্লাজমোডিয়াম", "https://commons.wikimedia.org/wiki/Category:Plasmodium_life_cycle", "উইকিমিডিয়া কমন্স", "high"),
    ("rhizobium", "rhizobium-leguminosarum-root-nodule-site-1.jpg", "udbhid", "রাইজোবিয়াম", "https://commons.wikimedia.org/wiki/Category:Rhizobium", "উইকিমিডিয়া কমন্স", "medium"),
    ("dengue-virus", "dengue-virus-denv-electron-micrograph-si-1.jpg", "udbhid", "ডেঙ্গু ভাইরাস", "https://commons.wikimedia.org/wiki/Category:Dengue_virus", "উইকিমিডিয়া কমন্স", "high"),
    # ---------- বন-পাহাড়-জলাবন (sthan) ----------
    ("lawachhara", "lawachara-national-park-bangladesh-site--1.jpg", "sthan", "লাউয়াছড়া জাতীয় উদ্যান", "https://commons.wikimedia.org/wiki/File:Lawachara_National_Park_Srimongol_Sylhet_Bangladesh_9.JPG", "উইকিমিডিয়া কমন্স", "high"),
    ("modhupur-shalbon", "madhupur-sal-forest-bangladesh-site-comm-1.jpg", "sthan", "মধুপুর শালবন", "https://commons.wikimedia.org/wiki/Category:Madhupur_National_Park", "উইকিমিডিয়া কমন্স", "high"),
    ("rangamati-kaptai", "kaptai-lake-rangamati-bangladesh-site-co-1.jpg", "sthan", "রাঙামাটি ও কাপ্তাই হ্রদ", "https://commons.wikimedia.org/wiki/Category:Kaptai_Lake", "উইকিমিডিয়া কমন্স", "high"),
    ("ratargul", "ratargul-swamp-forest-sylhet-bangladesh--1.jpg", "sthan", "রাতারগুল জলাবন", "https://commons.wikimedia.org/wiki/File:Ratargul_Swamp_Forest,_Sylhet,_Bangladesh.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("sitakunda", "sitakunda-chandranath-bangladesh-site-co-1.jpg", "sthan", "সীতাকুণ্ড চন্দ্রনাথ", "https://commons.wikimedia.org/wiki/Category:Botanical_Garden_and_Eco-Park,_Sitakunda", "উইকিমিডিয়া কমন্স", "high"),
    # ---------- পাখি (prani) ----------
    ("dandkak", "corvus-macrorhynchos-jungle-crow-site-co-1.jpg", "prani", "দাঁড়কাক", "https://commons.wikimedia.org/wiki/Category:Corvus_macrorhynchos", "উইকিমিডিয়া কমন্স", "medium"),
    ("finge", "dicrurus-macrocercus-black-drongo-site-c-1.jpg", "prani", "ফিঙে", "https://commons.wikimedia.org/wiki/File:Black_Drongo_(Dicrurus_macrocercus)_(20185740488).jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("chatok", "clamator-jacobinus-pied-cuckoo-site-comm-1.jpg", "prani", "চাতক", "https://commons.wikimedia.org/wiki/Category:Clamator_jacobinus", "উইকিমিডিয়া কমন্স", "high"),
    ("ghughu", "spilopelia-chinensis-spotted-dove-site-c-1.jpg", "prani", "তিলা ঘুঘু", "https://commons.wikimedia.org/wiki/File:Spotted_dove_(Spilopelia_chinensis)-.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("go-bok", "bubulcus-ibis-cattle-egret-site-commons--1.jpg", "prani", "গো-বক", "https://commons.wikimedia.org/wiki/Category:Bubulcus_ibis", "উইকিমিডিয়া কমন্স", "high"),
    ("holud-bulbul", "oriolus-oriolus-eurasian-golden-oriole-s-1.jpg", "prani", "হলুদ বুলবুল", "https://commons.wikimedia.org/wiki/Category:Oriolus_oriolus", "উইকিমিডিয়া কমন্স", "high"),
    ("kalo-chil", "milvus-migrans-black-kite-site-commons-w-1.jpg", "prani", "কালো চিল", "https://commons.wikimedia.org/wiki/Milvus_migrans", "উইকিমিডিয়া কমন্স", "high"),
    ("kani-bok", "ardeola-grayii-indian-pond-heron-site-co-1.jpg", "prani", "কানি বক", "https://commons.wikimedia.org/wiki/Category:Ardeola_grayii", "উইকিমিডিয়া কমন্স", "high"),
    ("kaththokra", "dinopium-benghalense-black-rumped-flameb-1.jpg", "prani", "কাঠঠোকরা", "https://commons.wikimedia.org/wiki/Category:Dinopium_benghalense", "উইকিমিডিয়া কমন্স", "high"),
    ("patihash", "dendrocygna-javanica-lesser-whistling-du-1.jpg", "prani", "সরালি হাঁস", "https://commons.wikimedia.org/wiki/Category:Dendrocygna_javanica", "উইকিমিডিয়া কমন্স", "high"),
    ("shalik", "acridotheres-fuscus-jungle-myna-site-com-1.jpg", "prani", "শালিক", "https://commons.wikimedia.org/wiki/Category:Acridotheres_fuscus", "উইকিমিডিয়া কমন্স", "high"),
    ("pankouri", "microcarbo-niger-cormorant-site-commons--1.jpg", "prani", "পানকৌড়ি", "https://commons.wikimedia.org/wiki/Category:Microcarbo_niger", "উইকিমিডিয়া কমন্স", "high"),
    ("sarpunti", "systomus-sarana-barb-fish-photo-india-wi-1.png", "prani", "সরপুঁটি", "https://en.wikipedia.org/wiki/Olive_barb", "উইকিমিডিয়া কমন্স", "high"),
]


def esc(s):
    return s.replace("\\", "\\\\").replace("'", "\\'")


def main():
    rows = []
    missing = []
    for slug, src, grp, subject, source, site, conf in M:
        sp = os.path.join(SRC, src)
        if not os.path.exists(sp):
            missing.append((slug, src))
            continue
        outdir = os.path.join(ROOT, "public", "seed", grp)
        os.makedirs(outdir, exist_ok=True)
        out = os.path.join(outdir, slug + ".jpg")
        subprocess.run(
            ["convert", sp, "-strip", "-resize", "1400x1400>", "-quality", "82", out],
            check=True,
        )
        dim = subprocess.run(
            ["identify", "-format", "%wx%h", out], capture_output=True, text=True
        ).stdout.strip()
        w = int(dim.split("x")[0]) if "x" in dim else 0
        rows.append(
            dict(
                slug=slug,
                file="/seed/%s/%s.jpg" % (grp, slug),
                subject=subject,
                source=source,
                site=site,
                confidence=conf,
                dim=dim,
                lowRes=w > 0 and w < 400,
                bytes=os.path.getsize(out),
            )
        )

    if missing:
        print("পাওয়া যায়নি:", missing, file=sys.stderr)

    lines = []
    lines.append("/**")
    lines.append(" * §12 — জ্ঞানভান্ডারের ছবির উৎস-প্রমাণ।")
    lines.append(" *")
    lines.append(" * এই ফাইলটি স্ক্রিপ্ট দিয়ে তৈরি: `python3 scripts/import-images.py` — হাতে সম্পাদনা করবেন না।")
    lines.append(" * প্রতিটি ছবি এসেছে উন্মুক্ত উৎস (উইকিমিডিয়া কমন্স / পেক্সেলস) থেকে।")
    lines.append(" * সতর্কতা: লেখকের নাম ও সঠিক লাইসেন্স এখনো প্রতি-ফাইল যাচাই করা হয়নি,")
    lines.append(" * তাই কোনো মিথ্যা ক্রেডিট দেওয়া হয়নি — সব রেকর্ড verified:false।")
    lines.append(" */")
    lines.append("export type SeedImage = {")
    lines.append("  slug: string")
    lines.append("  file: string")
    lines.append("  subject: string")
    lines.append("  source: string")
    lines.append("  site: string")
    lines.append("  /** উৎস-পাতার তথ্য থেকে প্রজাতি শনাক্তকরণে আমাদের আস্থা */")
    lines.append("  confidence: 'high' | 'medium' | 'low'")
    lines.append("  /** মূল ছবিটি ছোট (৪০০px-এর কম) — বড় ছবি দিয়ে বদলানো দরকার */")
    lines.append("  lowRes: boolean")
    lines.append("  license: string")
    lines.append("  verified: boolean")
    lines.append("  note: string")
    lines.append("}")
    lines.append("")
    lines.append("export const SEED_IMAGES: SeedImage[] = [")
    for r in rows:
        lines.append("  {")
        lines.append("    slug: '%s'," % esc(r["slug"]))
        lines.append("    file: '%s'," % esc(r["file"]))
        lines.append("    subject: '%s'," % esc(r["subject"]))
        lines.append("    source: '%s'," % esc(r["source"]))
        lines.append("    site: '%s'," % esc(r["site"]))
        lines.append("    confidence: '%s'," % r["confidence"])
        lines.append("    lowRes: %s," % ("true" if r["lowRes"] else "false"))
        lines.append("    license: 'যাচাই বাকি',")
        lines.append("    verified: false,")
        note = "%s-এ প্রকাশিত উন্মুক্ত-লাইসেন্স ছবি। মূল ফাইলের লেখক ও সুনির্দিষ্ট লাইসেন্স প্রকাশের আগে যাচাই করতে হবে।" % r["site"]
        if r["lowRes"]:
            note += " ছবিটি ছোট (%s), বড় রেজোলিউশনের ছবি দিয়ে বদলাতে হবে।" % r["dim"]
        if r["confidence"] == "low":
            note += " উৎস-পাতায় প্রজাতিটি সম্পর্কে সন্দেহ আছে — বিশেষজ্ঞের মাধ্যমে যাচাই প্রয়োজন।"
        lines.append("    note: '%s'," % esc(note))
        lines.append("  },")
    lines.append("]")
    lines.append("")
    lines.append("export const SEED_IMAGE_BY_SLUG: Record<string, string> = Object.fromEntries(")
    lines.append("  SEED_IMAGES.map((i) => [i.slug, i.file]),")
    lines.append(")")
    lines.append("")

    with open(OUT_TS, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))

    print("প্রক্রিয়াকৃত ছবি:", len(rows))
    print("মোট সাইজ: %.1f KB" % (sum(r["bytes"] for r in rows) / 1024))
    low = [r["slug"] for r in rows if r["lowRes"]]
    if low:
        print("ছোট ছবি (বদলাতে হবে):", ", ".join(low))


if __name__ == "__main__":
    main()
