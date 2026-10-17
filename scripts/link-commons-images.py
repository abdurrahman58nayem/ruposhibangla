#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
§12 — ছবিহীন প্রজাতিতে উইকিমিডিয়া কমন্সের ছবি লিংক করা।

data/seed/media-images.ts-এ থাকা রেকর্ডগুলো সরাসরি `withSeedImages()`-এর মাধ্যমে
প্রজাতির `image` ক্ষেত্রে বসে যায় — তাই সিড ফাইলগুলোতে হাত দেওয়ার দরকার নেই।

কাজের ধারা:
  1) python3 scripts/link-commons-images.py --titles
     -> কমন্স API-এর titles ব্যাচ প্রিন্ট করে (লেখক/লাইসেন্স জানতে)।
  2) API রেসপন্স /tmp/commons-meta-1.json, /tmp/commons-meta-2.json ...-এ রাখুন।
  3) python3 scripts/link-commons-images.py --apply
     -> media-images.ts-এ ছবির রেকর্ড + media-licenses.ts-এ লাইসেন্স রেকর্ড যোগ করে।

নিয়ম (§12):
  * শুধু উইকিমিডিয়া কমন্স — মুক্ত/উন্মুক্ত লাইসেন্স।
  * লেখক ও লাইসেন্স কমন্স API-এর extmetadata থেকে আসে; না পাওয়া গেলে
    verified:false ("যাচাই বাকি") — কখনোই কল্পিত ক্রেডিট নয়।
  * মানচিত্র/রেঞ্জ-ম্যাপ/স্ট্যাম্প/ডায়াগ্রাম বাদ (সেগুলো প্রজাতির ছবি নয়)।
  * idempotent — একাধিকবার চালালে একই স্লাগের রেকর্ড দুবার যোগ হবে না।
"""

import html
import json
import os
import re
import sys
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_TS = os.path.join(ROOT, "data", "seed", "media-images.ts")
LICENSES_TS = os.path.join(ROOT, "data", "seed", "media-licenses.ts")

BATCH = "৪৫"

# slug, কমন্স ফাইলের নাম (File: ছাড়া), ছবির URL, আস্থা (high/medium/low)
# URL-গুলো কমন্স API-এর thumburl/original থেকে নেওয়া — utm_* প্যারামিটার বাদ দেওয়া হয়েছে।
ROWS = [
    ("sero", "Serow_Capricornis_sumatraensis.JPG", "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Serow_Capricornis_sumatraensis.JPG/960px-Serow_Capricornis_sumatraensis.JPG", "high"),
    ("borahing", "Hog_deer12.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Hog_deer12.jpg/960px-Hog_deer12.jpg", "high"),
    ("sonali-banbidal", "Asian_Golden_cat.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Asian_Golden_cat.jpg/960px-Asian_Golden_cat.jpg", "high"),
    ("tulay-banbidal", "Marbled_cat_borneo.jpg", "https://upload.wikimedia.org/wikipedia/commons/3/3f/Marbled_cat_borneo.jpg", "high"),
    ("chita-bidal", "Prionailurus_bengalensis_bengalensis_2-Découpe.JPG", "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Prionailurus_bengalensis_bengalensis_2-D%C3%A9coupe.JPG/960px-Prionailurus_bengalensis_bengalensis_2-D%C3%A9coupe.JPG", "high"),
    ("binturong", "Binturong_in_Overloon.jpg", "https://upload.wikimedia.org/wikipedia/commons/a/a7/Binturong_in_Overloon.jpg", "high"),
    ("tin-dagi-tala-bidal", "Small-toothed_Palm_Civet_(Arctogalidia_trivirgata_stigmatica)_(8076736823)_(cut).jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Small-toothed_Palm_Civet_%28Arctogalidia_trivirgata_stigmatica%29_%288076736823%29_%28cut%29.jpg/960px-Small-toothed_Palm_Civet_%28Arctogalidia_trivirgata_stigmatica%29_%288076736823%29_%28cut%29.jpg", "high"),
    ("mukhosh-tala-bidal", "Palm_civet_on_tree_(detail).jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Palm_civet_on_tree_%28detail%29.jpg/960px-Palm_civet_on_tree_%28detail%29.jpg", "high"),
    ("tala-bidal", "Common_Palm_Civet_(Paradoxurus_hermaphroditus)_(7781509830).jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Common_Palm_Civet_%28Paradoxurus_hermaphroditus%29_%287781509830%29.jpg/960px-Common_Palm_Civet_%28Paradoxurus_hermaphroditus%29_%287781509830%29.jpg", "high"),
    ("kakra-bhoji-nokul", "Urva_urva_77938111.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Urva_urva_77938111.jpg/960px-Urva_urva_77938111.jpg", "high"),
    ("bangla-shiyal", "Bengal_Fox_-_Shreeram_M_V_-_Rajasthan,_India.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Bengal_Fox_-_Shreeram_M_V_-_Rajasthan%2C_India.jpg/960px-Bengal_Fox_-_Shreeram_M_V_-_Rajasthan%2C_India.jpg", "high"),
    ("lal-shiyal", "Portrait_of_a_red_fox_in_Rautas_fjällurskog_(cropped).jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Portrait_of_a_red_fox_in_Rautas_fj%C3%A4llurskog_%28cropped%29.jpg/960px-Portrait_of_a_red_fox_in_Rautas_fj%C3%A4llurskog_%28cropped%29.jpg", "high"),
    ("surjo-bhaluk", "Sun-bear.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/Sun-bear.jpg/960px-Sun-bear.jpg", "high"),
    ("chhoto-bhodor", "Otter_-_melbourne_zoo.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Otter_-_melbourne_zoo.jpg/960px-Otter_-_melbourne_zoo.jpg", "medium"),
    ("uttorer-shukor-bang", "Recherches_pour_servir_à_l'histoire_naturelle_des_mammifères_(Pl._62)_(7093196697).jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Recherches_pour_servir_%C3%A0_l%27histoire_naturelle_des_mammif%C3%A8res_%28Pl._62%29_%287093196697%29.jpg/960px-Recherches_pour_servir_%C3%A0_l%27histoire_naturelle_des_mammif%C3%A8res_%28Pl._62%29_%287093196697%29.jpg", "low"),
    ("boro-shukor-bang", "Arctonyx-collaris-hog-badger.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Arctonyx-collaris-hog-badger.jpg/960px-Arctonyx-collaris-hog-badger.jpg", "high"),
    ("holudgola-marten", "Martes_flavigula,_yellow-throated_marten.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Martes_flavigula%2C_yellow-throated_marten.jpg/960px-Martes_flavigula%2C_yellow-throated_marten.jpg", "high"),
    ("burmi-ferret-bang", "Melogale_personata_430234837.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Melogale_personata_430234837.jpg/960px-Melogale_personata_430234837.jpg", "high"),
    ("chhoto-mingtimi", "SBNMS_-_Minke_Whale_-_Breach_(28670557361).jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/SBNMS_-_Minke_Whale_-_Breach_%2828670557361%29.jpg/960px-SBNMS_-_Minke_Whale_-_Breach_%2828670557361%29.jpg", "high"),
    ("braids-timi", "Balaenoptera_edeni_edeni_93433630.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Balaenoptera_edeni_edeni_93433630.jpg/960px-Balaenoptera_edeni_edeni_93433630.jpg", "high"),
    ("edens-timi", "Balaenoptera_edeni_245799020.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Balaenoptera_edeni_245799020.jpg/960px-Balaenoptera_edeni_245799020.jpg", "high"),
    ("fin-timi", "Finhval_(1).jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Finhval_%281%29.jpg/960px-Finhval_%281%29.jpg", "high"),
    ("humpback-timi", "Humpback_whale_breaching_off_Cabo_San_Lucas.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Humpback_whale_breaching_off_Cabo_San_Lucas.jpg/960px-Humpback_whale_breaching_off_Cabo_San_Lucas.jpg", "high"),
    ("sperm-timi", "Mother_and_baby_sperm_whale.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Mother_and_baby_sperm_whale.jpg/960px-Mother_and_baby_sperm_whale.jpg", "high"),
    ("nirno-porpoise", "Neophocaena_phocaenoides_31299547.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/Neophocaena_phocaenoides_31299547.jpg/960px-Neophocaena_phocaenoides_31299547.jpg", "high"),
    ("pigmy-killer-hol", "Pygmy_killer_whales_(Feresa_attenuata)_off_of_Guam_(anim252384854).jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Pygmy_killer_whales_%28Feresa_attenuata%29_off_of_Guam_%28anim252384854%29.jpg/960px-Pygmy_killer_whales_%28Feresa_attenuata%29_off_of_Guam_%28anim252384854%29.jpg", "high"),
    ("pilot-timi", "Globicephala_macrorhynchus_Kurzflossen-Grindwal_DSCF8148.JPG", "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/Globicephala_macrorhynchus_Kurzflossen-Grindwal_DSCF8148.JPG/960px-Globicephala_macrorhynchus_Kurzflossen-Grindwal_DSCF8148.JPG", "high"),
    ("risos-dolphin", "Grampo.jpg", "https://upload.wikimedia.org/wikipedia/commons/9/93/Grampo.jpg", "medium"),
    ("frazers-dolphin", "Frazer´s_dolphin_group.jpg", "https://upload.wikimedia.org/wikipedia/commons/2/2b/Frazer%C2%B4s_dolphin_group.jpg", "medium"),
    ("melon-headed-hol", "Peponocephala_electra_Mayotte.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Peponocephala_electra_Mayotte.jpg/960px-Peponocephala_electra_Mayotte.jpg", "high"),
    ("false-killer-hol", "Pseudoorca_Crassidens_-_False_Killer_Whale.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Pseudoorca_Crassidens_-_False_Killer_Whale.jpg/960px-Pseudoorca_Crassidens_-_False_Killer_Whale.jpg", "high"),
    ("dagi-dolphin", "Pantropical_spotted_dolphin_swimming_off_the_coast_of_Costa_Rica.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Pantropical_spotted_dolphin_swimming_off_the_coast_of_Costa_Rica.jpg/960px-Pantropical_spotted_dolphin_swimming_off_the_coast_of_Costa_Rica.jpg", "high"),
    ("ghuroni-dolphin", "Gray's_spinner_dolphin_(Stenella_longirostris_longirostris)_Panglao_(cropped).jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Gray%27s_spinner_dolphin_%28Stenella_longirostris_longirostris%29_Panglao_%28cropped%29.jpg/960px-Gray%27s_spinner_dolphin_%28Stenella_longirostris_longirostris%29_Panglao_%28cropped%29.jpg", "high"),
    ("dantaloo-dolphin", "Steno_bredanensis_LB_1.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Steno_bredanensis_LB_1.jpg/960px-Steno_bredanensis_LB_1.jpg", "high"),
    ("humpback-dolphin", "Pink_Dolphin.JPG", "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Pink_Dolphin.JPG/960px-Pink_Dolphin.JPG", "medium"),
    ("indo-pacific-bottlenose", "Tursiops_aduncus,_Port_River,_Adelaide,_Australia_-_2003.jpg", "https://upload.wikimedia.org/wikipedia/commons/8/87/Tursiops_aduncus%2C_Port_River%2C_Adelaide%2C_Australia_-_2003.jpg", "high"),
    ("bottlenose-dolphin", "Tursiops_truncatus_01-cropped.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Tursiops_truncatus_01-cropped.jpg/960px-Tursiops_truncatus_01-cropped.jpg", "high"),
    ("chhoto-mouse-kan-badur", "Myotis_blythii_02.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Myotis_blythii_02.jpg/960px-Myotis_blythii_02.jpg", "high"),
    ("gofwala-badur", "Myoti_murico_060615_7419_cklpa.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Myoti_murico_060615_7419_cklpa.jpg/960px-Myoti_murico_060615_7419_cklpa.jpg", "high"),
    ("himalayi-gofwala-badur", "Myotis_siligorensis.jpg", "https://upload.wikimedia.org/wikipedia/commons/e/e7/Myotis_siligorensis.jpg", "high"),
    ("chhoto-holud-badur", "Scotophilus_kuhlii_(Bukidnon,_Philippines)_1.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Scotophilus_kuhlii_%28Bukidnon%2C_Philippines%29_1.jpg/960px-Scotophilus_kuhlii_%28Bukidnon%2C_Philippines%29_1.jpg", "high"),
    ("chhoto-bansh-badur", "Lesser_Bamboo_Bat.JPG", "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Lesser_Bamboo_Bat.JPG/960px-Lesser_Bamboo_Bat.JPG", "high"),
    ("chhoto-banka-dana-badur", "Small_bent_wing_bat.jpg", "https://upload.wikimedia.org/wikipedia/commons/c/cb/Small_bent_wing_bat.jpg", "medium"),
    ("chhoto-mouse-lej-badur", "Lesser_Mouse-_tailed_Bat_(Rhinopoma_hardwickii).jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Lesser_Mouse-_tailed_Bat_%28Rhinopoma_hardwickii%29.jpg/960px-Lesser_Mouse-_tailed_Bat_%28Rhinopoma_hardwickii%29.jpg", "high"),
    ("boro-mouse-lej-badur", "Greater_Mouse_Tailed_bat_(Rhinopoma_microphyllum).jpg", "https://upload.wikimedia.org/wikipedia/commons/0/04/Greater_Mouse_Tailed_bat_%28Rhinopoma_microphyllum%29.jpg", "high"),
    ("kuchkano-oth-badur", "Chaerephon_plicatus_Hardwicke.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Chaerephon_plicatus_Hardwicke.jpg/960px-Chaerephon_plicatus_Hardwicke.jpg", "medium"),
    ("nogn-pet-tholi-badur", "Naturalis_Biodiversity_Center_-_RMNH.MAM.32650.b_pal_-_Saccolaimus_saccolaimus_-_skin.jpeg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/Naturalis_Biodiversity_Center_-_RMNH.MAM.32650.b_pal_-_Saccolaimus_saccolaimus_-_skin.jpeg/960px-Naturalis_Biodiversity_Center_-_RMNH.MAM.32650.b_pal_-_Saccolaimus_saccolaimus_-_skin.jpeg", "medium"),
    ("lomba-dana-kobor-badur", "Taphozous_longimanus_-_Museo_Civico_di_Storia_Naturale_Giacomo_Doria_-_Genoa,_Italy_-_DSC02550.JPG", "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Taphozous_longimanus_-_Museo_Civico_di_Storia_Naturale_Giacomo_Doria_-_Genoa%2C_Italy_-_DSC02550.JPG/960px-Taphozous_longimanus_-_Museo_Civico_di_Storia_Naturale_Giacomo_Doria_-_Genoa%2C_Italy_-_DSC02550.JPG", "medium"),
    ("madhyomo-ashwonash-badur", "Rhinolophus_affinis_86903750.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Rhinolophus_affinis_86903750.jpg/960px-Rhinolophus_affinis_86903750.jpg", "high"),
    ("lejhina-patanak-badur", "Coelops_frithii_2.jpg", "https://upload.wikimedia.org/wikipedia/commons/3/3e/Coelops_frithii_2.jpg", "medium"),
    ("dhoomketu-golpata-badur", "Hipposideros_ater_by_Nameer.jpg", "https://upload.wikimedia.org/wikipedia/commons/e/ef/Hipposideros_ater_by_Nameer.jpg", "high"),
    ("bharotiyo-golpata-badur", "Hipposideros_lankadiva_Kelaart's_leaf-nosed_bat_1.jpg", "https://upload.wikimedia.org/wikipedia/commons/8/8e/Hipposideros_lankadiva_Kelaart%27s_leaf-nosed_bat_1.jpg", "high"),
    ("madhyomo-golpata-badur", "Hippos_larvat_080116-3505_hurn.JPG", "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Hippos_larvat_080116-3505_hurn.JPG/960px-Hippos_larvat_080116-3505_hurn.JPG", "high"),
    ("boro-golpata-badur", "Great_roundleaf_bat_(Hipposideros_armiger).jpg", "https://upload.wikimedia.org/wikipedia/commons/3/36/Great_roundleaf_bat_%28Hipposideros_armiger%29.jpg", "high"),
    ("himalayi-ondho-indur", "Euroscaptor_micrurus.png", "https://upload.wikimedia.org/wikipedia/commons/5/58/Euroscaptor_micrurus.png", "high"),
    ("dokkhin-purbo-chuchundro", "Southeast_Asian_Shrew-_iNaturalist_photo_245798384.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Southeast_Asian_Shrew-_iNaturalist_photo_245798384.jpg/960px-Southeast_Asian_Shrew-_iNaturalist_photo_245798384.jpg", "high"),
    ("stoliczkaner-chuchundro", "Suncus_stoliczkanus.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Suncus_stoliczkanus.jpg/960px-Suncus_stoliczkanus.jpg", "high"),
    ("katkhalir-khorgosh", "Caprolagus_hispidus_Chitwan_Rediscovery_2017.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Caprolagus_hispidus_Chitwan_Rediscovery_2017.jpg/960px-Caprolagus_hispidus_Chitwan_Rediscovery_2017.jpg", "high"),
    ("sunda-bonrui", "Pangolin_borneo.jpg", "https://upload.wikimedia.org/wikipedia/commons/4/42/Pangolin_borneo.jpg", "high"),
    ("sunda-lojjabati-banor", "Nycticebus_coucang_004.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Nycticebus_coucang_004.jpg/960px-Nycticebus_coucang_004.jpg", "high"),
    ("kuchkule-lej-banor", "Macaca_arctoides_624873256.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Macaca_arctoides_624873256.jpg/960px-Macaca_arctoides_624873256.jpg", "high"),
    ("asami-banor", "Macaca_assamensis_461965689.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Macaca_assamensis_461965689.jpg/960px-Macaca_assamensis_461965689.jpg", "high"),
    ("kakra-bhoji-banor", "Ubud_Monkey_Family.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Ubud_Monkey_Family.jpg/960px-Ubud_Monkey_Family.jpg", "high"),
    ("uttorer-bagh-lej-banor", "Macaca_leonina_mother_with_baby_-_Khao_Yai.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Macaca_leonina_mother_with_baby_-_Khao_Yai.jpg/960px-Macaca_leonina_mother_with_baby_-_Khao_Yai.jpg", "high"),
    ("uttorer-dhushor-langur", "Northern_plains_gray_langur.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Northern_plains_gray_langur.jpg/960px-Northern_plains_gray_langur.jpg", "high"),
    ("dhoomketu-pata-banor", "Dusky_leaf_monkey_(8050982300).jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Dusky_leaf_monkey_%288050982300%29.jpg/960px-Dusky_leaf_monkey_%288050982300%29.jpg", "high"),
    ("pochhima-hoolock-gibbon", "Hoolock_hoolock_001.jpg", "https://upload.wikimedia.org/wikipedia/commons/2/2b/Hoolock_hoolock_001.jpg", "high"),
    ("lej-jhuri-sajaru", "Brush-tailed_Porcupine,_Atherurus_macrourus_in_Kaeng_Krachan_national_park_(15925250476).jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/Brush-tailed_Porcupine%2C_Atherurus_macrourus_in_Kaeng_Krachan_national_park_%2815925250476%29.jpg/960px-Brush-tailed_Porcupine%2C_Atherurus_macrourus_in_Kaeng_Krachan_national_park_%2815925250476%29.jpg", "high"),
    ("malay-sajaru", "Hystrix_brachyura,_Malayan_porcupine.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Hystrix_brachyura%2C_Malayan_porcupine.jpg/960px-Hystrix_brachyura%2C_Malayan_porcupine.jpg", "high"),
    ("kalo-bishal-kathbiral", "Ratufa_bicolor_6237.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Ratufa_bicolor_6237.jpg/960px-Ratufa_bicolor_6237.jpg", "high"),
    ("bharotiyo-tal-kathbiral", "Funambulus_palmarum_(Bengaluru).jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Funambulus_palmarum_%28Bengaluru%29.jpg/960px-Funambulus_palmarum_%28Bengaluru%29.jpg", "high"),
    ("dagi-urnonto-kathbiral", "Particolored_flying_squirrel.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Particolored_flying_squirrel.jpg/960px-Particolored_flying_squirrel.jpg", "high"),
    ("bhutani-bishal-urnonto-kathbiral", "Petaurista_nobilis_(Sikkim,_India)2.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Petaurista_nobilis_%28Sikkim%2C_India%292.jpg/960px-Petaurista_nobilis_%28Sikkim%2C_India%292.jpg", "high"),
    ("komola-pet-himalayi-kathbiral", "Orange-bellied_Himalayan_Squirrel_Khangchendzonga_Biosphere_Reserve_West_Sikkim_India_25.10.2015.jpg", "https://upload.wikimedia.org/wikipedia/commons/4/44/Orange-bellied_Himalayan_Squirrel_Khangchendzonga_Biosphere_Reserve_West_Sikkim_India_25.10.2015.jpg", "high"),
    ("irabadi-kathbiral", "Hoary-bellied_Himalayan_squirrel_(Callosciurus_pygerythrus)_Nagarjun.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Hoary-bellied_Himalayan_squirrel_%28Callosciurus_pygerythrus%29_Nagarjun.jpg/960px-Hoary-bellied_Himalayan_squirrel_%28Callosciurus_pygerythrus%29_Nagarjun.jpg", "high"),
    ("pallas-kathbiral", "Pallas's_squirrel_(Callosciurus_erythraeus_thaiwanensis)_Qianshan.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Pallas%27s_squirrel_%28Callosciurus_erythraeus_thaiwanensis%29_Qianshan.jpg/960px-Pallas%27s_squirrel_%28Callosciurus_erythraeus_thaiwanensis%29_Qianshan.jpg", "high"),
    ("chhoto-bansh-indur", "Cannomys_badius_Plzen_zoo.jpg", "https://upload.wikimedia.org/wikipedia/commons/b/b3/Cannomys_badius_Plzen_zoo.jpg", "medium"),
    ("boro-bandicut-indur", "Bandicota_indica.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Bandicota_indica.jpg/960px-Bandicota_indica.jpg", "high"),
    ("lomba-lej-bishal-indur", "Leopoldamys_sabanus.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Leopoldamys_sabanus.jpg/960px-Leopoldamys_sabanus.jpg", "high"),
    ("badami-indur", "Brown_Rat_(Rattus_norvegicus).jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Brown_Rat_%28Rattus_norvegicus%29.jpg/960px-Brown_Rat_%28Rattus_norvegicus%29.jpg", "high"),
    ("norom-lom-indur", "Millardia_meltada.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Millardia_meltada.jpg/960px-Millardia_meltada.jpg", "high"),
    ("chhoto-lej-bandicut-indur", "NesokiaHuttoni.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/NesokiaHuttoni.jpg/960px-NesokiaHuttoni.jpg", "high"),
    ("china-sadapet-indur", "Niviventer_fulvescens_HS_2108.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Niviventer_fulvescens_HS_2108.jpg/960px-Niviventer_fulvescens_HS_2108.jpg", "high"),
    ("polynesian-indur", "Starr-141030-2690-Eucalyptus_globulus-habitat_with_Polynesian_rat_in_parking_lot-Hosmers_Grove_HNP-Maui_(25129932392).jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Starr-141030-2690-Eucalyptus_globulus-habitat_with_Polynesian_rat_in_parking_lot-Hosmers_Grove_HNP-Maui_%2825129932392%29.jpg/960px-Starr-141030-2690-Eucalyptus_globulus-habitat_with_Polynesian_rat_in_parking_lot-Hosmers_Grove_HNP-Maui_%2825129932392%29.jpg", "high"),
    ("himalayi-math-indur", "Rattus_nitidus.jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Rattus_nitidus.jpg/960px-Rattus_nitidus.jpg", "high"),
    ("tanezumi-indur", "Rattus_tanezumi_-_1700-1880_-_Print_-_Iconographia_Zoologica_-_Special_Collections_University_of_Amsterdam.png", "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Rattus_tanezumi_-_1700-1880_-_Print_-_Iconographia_Zoologica_-_Special_Collections_University_of_Amsterdam.png/960px-Rattus_tanezumi_-_1700-1880_-_Print_-_Iconographia_Zoologica_-_Special_Collections_University_of_Amsterdam.png", "low"),
    ("lomba-lej-orohi-indur", "Asiatic_Long-tailed_Climbing_Mouse_Vandeleuria_oleracea_by_Dr._Raju_Kasambe_DSCN0383_(10).jpg", "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Asiatic_Long-tailed_Climbing_Mouse_Vandeleuria_oleracea_by_Dr._Raju_Kasambe_DSCN0383_%2810%29.jpg/960px-Asiatic_Long-tailed_Climbing_Mouse_Vandeleuria_oleracea_by_Dr._Raju_Kasambe_DSCN0383_%2810%29.jpg", "high"),
    ("manush", "Akha_cropped_hires.JPG", "https://upload.wikimedia.org/wikipedia/commons/6/68/Akha_cropped_hires.JPG", "medium"),
]

# যেসব লাইসেন্সে লেখকের নাম দেওয়া বাধ্যতামূলক নয় (ক্রেডিট না থাকলেও যাচাইকৃত)
NO_CREDIT_REQUIRED = ('Public domain', 'CC0', 'PD')

# স্লাগ -> বাংলা নাম (ক্রেডিট টেবিলে বিষয় হিসেবে দেখানো হয়)
BN = {
    'asami-banor': 'আসামি বানর',
    'badami-indur': 'বাদামি ইঁদুর',
    'bangla-shiyal': 'বাংলা শিয়াল',
    'bharotiyo-golpata-badur': 'ভারতীয় গোলপাতা বাদুড়',
    'bharotiyo-tal-kathbiral': 'ভারতীয় তাল কাঠবিড়ালি',
    'bhutani-bishal-urnonto-kathbiral': 'ভুটানি বিশাল উড়ন্ত কাঠবিড়ালি',
    'binturong': 'বিনটুরং',
    'borahing': 'বরাহিঙ্গ',
    'boro-bandicut-indur': 'বড় ব্যান্ডিকুট ইঁদুর',
    'boro-golpata-badur': 'বড় গোলপাতা বাদুড়',
    'boro-mouse-lej-badur': 'বড় মাউস-লেজ বাদুড়',
    'boro-shukor-bang': 'বড় শূকর-ব্যাঙ্গ',
    'bottlenose-dolphin': 'বোতলনাক ডলফিন',
    'braids-timi': 'ব্রাইডস তিমি',
    'burmi-ferret-bang': 'বর্মি ফেরেট-ব্যাঙ্গ',
    'chhoto-banka-dana-badur': 'ছোট বাঁকা-ডানা বাদুড়',
    'chhoto-bansh-badur': 'ছোট বাঁশ বাদুড়',
    'chhoto-bansh-indur': 'ছোট বাঁশ ইঁদুর',
    'chhoto-bhodor': 'ছোট ভোঁদড়',
    'chhoto-holud-badur': 'ছোট এশীয় হলুদ বাদুড়',
    'chhoto-lej-bandicut-indur': 'ছোট-লেজ ব্যান্ডিকুট ইঁদুর',
    'chhoto-mingtimi': 'ছোট মিং তিমি',
    'chhoto-mouse-kan-badur': 'ছোট মাউস-কান বাদুড়',
    'chhoto-mouse-lej-badur': 'ছোট মাউস-লেজ বাদুড়',
    'china-sadapet-indur': 'চিনা-সাদাপেট ইঁদুর',
    'chita-bidal': 'চিতা বিড়াল',
    'dagi-dolphin': 'দাগওয়ালা ডলফিন',
    'dagi-urnonto-kathbiral': 'দাগওয়ালা উড়ন্ত কাঠবিড়ালি',
    'dantaloo-dolphin': 'দাঁতালো ডলফিন',
    'dhoomketu-golpata-badur': 'ধোঁয়াটে গোলপাতা বাদুড়',
    'dhoomketu-pata-banor': 'ধোঁয়াটে পাতা বানর',
    'dokkhin-purbo-chuchundro': 'দক্ষিণ-পূর্ব এশীয় ছুচুন্দ্র',
    'dormers-pipistrelle': 'ডরমার্স পিপিস্ট্রেল',
    'edens-timi': 'ইডেনস তিমি',
    'false-killer-hol': 'ভুয়া কিলার হোয়েল',
    'fin-timi': 'ফিন তিমি',
    'frazers-dolphin': 'ফ্রেজার্স ডলফিন',
    'ghuroni-dolphin': 'ঘূর্ণায়মান ডলফিন',
    'gofwala-badur': 'গোঁফওয়ালা বাদুড়',
    'himalayi-gofwala-badur': 'হিমালয়ান গোঁফওয়ালা বাদুড়',
    'himalayi-math-indur': 'হিমালয়ান মাঠ ইঁদুর',
    'himalayi-ondho-indur': 'হিমালয়ান মোল',
    'holudgola-marten': 'হলুদগলা মার্টেন',
    'humpback-dolphin': 'পূর্ব-প্রশান্ত হাম্পব্যাক ডলফিন',
    'humpback-timi': 'হাম্পব্যাক তিমি',
    'indo-pacific-bottlenose': 'ইন্দো-প্রশান্ত বোতলনাক ডলফিন',
    'irabadi-kathbiral': 'ইরাবদি কাঠবিড়ালি',
    'kakra-bhoji-banor': 'কাঁকড়াভোজী বানর',
    'kakra-bhoji-nokul': 'কাঁকড়াভোজী নকুল',
    'kalo-bishal-kathbiral': 'কালো বিশাল কাঠবিড়ালি',
    'katkhalir-khorgosh': 'কাটখালী খরগোশ',
    'komola-pet-himalayi-kathbiral': 'কমলা-পেট হিমালয়ান কাঠবিড়ালি',
    'kuchkano-oth-badur': 'কুঁচকানো ওঠ বাদুড়',
    'kuchkule-lej-banor': 'কুঁচুলে লেজ বানর',
    'lal-shiyal': 'লাল শিয়াল',
    'lej-jhuri-sajaru': 'এশীয় লেজ-ঝাড়ু সজারু',
    'lejhina-patanak-badur': 'লেজহীন পাতানাক বাদুড়',
    'lomba-dana-kobor-badur': 'লম্বা-ডানা কবর বাদুড়',
    'lomba-lej-bishal-indur': 'লম্বা-লেজ বিশাল ইঁদুর',
    'lomba-lej-orohi-indur': 'এশীয় লম্বা-লেজ আরোহী ইঁদুর',
    'lomshomukhi-badur': 'লোমশমুখী বাদুড়',
    'madhyomo-ashwonash-badur': 'মধ্যম অশ্বনাস বাদুড়',
    'madhyomo-golpata-badur': 'মধ্যম গোলপাতা বাদুড়',
    'malay-sajaru': 'মালয় সজারু',
    'manush': 'মানুষ',
    'melon-headed-hol': 'মেলন-হেড হোয়েল',
    'moru-holud-badur': 'মরু হলুদ বাদুড়',
    'mukhosh-tala-bidal': 'মুখোশধারী তাল বিড়াল',
    'nirno-porpoise': 'নিখুঁত পোরপোইজ',
    'nogn-pet-tholi-badur': 'নগ্ন-পেট থলি বাদুড়',
    'norom-lom-indur': 'নরম-লোম ইঁদুর',
    'pallas-kathbiral': 'প্যালাসের কাঠবিড়ালি',
    'pigmy-killer-hol': 'পিগমি কিলার হোয়েল',
    'pilot-timi': 'পাইলট তিমি',
    'pochhima-hoolock-gibbon': 'পশ্চিমা হুলক গিবন',
    'polynesian-indur': 'পলিনেশীয় ইঁদুর',
    'risos-dolphin': 'রিসোস ডলফিন',
    'sero': 'সেরো',
    'sonali-banbidal': 'সোনালি বনবিড়াল',
    'sperm-timi': 'স্পার্ম তিমি',
    'stoliczkaner-chuchundro': 'স্টোলিজকানের ছুচুন্দ্র',
    'sunda-bonrui': 'সুন্দা বনরুই',
    'sunda-lojjabati-banor': 'সুন্দা লজ্জাবতী বানর',
    'surjo-bhaluk': 'সূর্য ভালুক',
    'tala-bidal': 'তাল বিড়াল',
    'tanezumi-indur': 'তানেজুমি ইঁদুর',
    'tin-dagi-tala-bidal': 'তিন-দাগী তাল বিড়াল',
    'tulay-banbidal': 'তুলায় বনবিড়াল',
    'uttorer-bagh-lej-banor': 'উত্তরের বাঘ-লেজ বানর',
    'uttorer-dhushor-langur': 'উত্তরের ধূসর ল্যাঙ্গুর',
    'uttorer-shukor-bang': 'উত্তরের শূকর-ব্যাঙ্গ',
}

# কমন্সের LicenseShortName -> লাইসেন্স-ডিডের লিংক
LICENSE_URLS = {
    "CC0": "https://creativecommons.org/publicdomain/zero/1.0/",
    "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
    "CC BY 2.5": "https://creativecommons.org/licenses/by/2.5/",
    "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
    "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
    "CC BY-SA 1.0": "https://creativecommons.org/licenses/by-sa/1.0/",
    "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/",
    "CC BY-SA 2.0 de": "https://creativecommons.org/licenses/by-sa/2.0/",
    "CC BY-SA 2.5": "https://creativecommons.org/licenses/by-sa/2.5/",
    "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
    "CC BY-SA 3.0 de": "https://creativecommons.org/licenses/by-sa/3.0/",
    "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
    "GFDL 1.2": "https://www.gnu.org/licenses/old-licenses/fdl-1.2.html",
    "CC BY-NC 2.0": "https://creativecommons.org/licenses/by-nc/2.0/",
    "CC BY-NC 4.0": "https://creativecommons.org/licenses/by-nc/4.0/",
    "CC BY-NC-SA 2.0": "https://creativecommons.org/licenses/by-nc-sa/2.0/",
    "CC BY-NC-SA 4.0": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    "Public domain": "https://en.wikipedia.org/wiki/Public_domain",
    "PD": "https://en.wikipedia.org/wiki/Public_domain",
}


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def file_page(name: str) -> str:
    """কমন্স ফাইল-পাতার URL (§12: উৎসের লিংক বাধ্যতামূলক)।"""
    return "https://commons.wikimedia.org/wiki/File:" + urllib.parse.quote(name.replace(" ", "_"))


def clean_html(value: str) -> str:
    """extmetadata-এর Artist ক্ষেত্র HTML — প্লেইন টেক্সটে নামে পরিণত করা।

    কমন্সের Artist ক্ষেত্রে অনেক সময় ইমেইল, ক্যামেরার তথ্য ও টেমপ্লেট-টেক্সট
    মিশে থাকে; ক্রেডিট-লাইনে শুধু লেখকের নামটিই দেখানো হয়।
    """
    text = re.sub(r"<[^>]+>", "\n", value)
    text = html.unescape(text)
    lines = [re.sub(r"\s+", " ", ln).strip() for ln in text.splitlines()]
    lines = [ln for ln in lines if ln]
    if not lines:
        return ""
    name = lines[0]
    for marker in ("[at]", "@", "http", "www.", ","):
        if marker in name:
            name = name.split(marker)[0]
    name = name.strip(" /-–—")
    # "Unknown authorUnknown author" ধরনের দ্বৈত পুনরাবৃত্তি সাফ করা
    half = len(name) // 2
    if len(name) > 8 and len(name) % 2 == 0 and name[:half] == name[half:]:
        name = name[:half]
    return name[:90]


def cmd_titles() -> None:
    """কমন্স API-এর titles ব্যাচ প্রিন্ট করে (লেখক/লাইসেন্স যাচাইয়ের জন্য)।"""
    names = ["File:" + r[1] for r in ROWS]
    step = 44
    for i in range(0, len(names), step):
        chunk = names[i:i + step]
        url = (
            "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2"
            "&prop=imageinfo&iiprop=extmetadata&iiextmetadatafilter=LicenseShortName%7CArtist"
            "&titles=" + urllib.parse.quote("|".join(chunk))
        )
        print("BATCH %d -> /tmp/commons-meta-%d.json" % (i // step + 1, i // step + 1))
        print(url)
        print()


def load_meta() -> dict:
    """সব /tmp/commons-meta-*.json মিলিয়ে file -> {license, artist} মানচিত্র।"""
    out = {}
    index = 1
    while True:
        path = "/tmp/commons-meta-%d.json" % index
        if not os.path.exists(path):
            break
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
        for page in data.get("query", {}).get("pages", []):
            title = page.get("title", "")
            if not title.startswith("File:"):
                continue
            info = (page.get("imageinfo") or [{}])[0]
            meta = info.get("extmetadata") or {}
            # API টাইটেল স্পেস-ফর্মে ফেরত দেয়; ROWS-এ আন্ডারস্কোর-ফর্ম — দুটোতেই খোঁজা যায়।
            for key in {title[5:], title[5:].replace(" ", "_")}:
                out[key] = {
                    "license": (meta.get("LicenseShortName") or {}).get("value", ""),
                    "artist": (meta.get("Artist") or {}).get("value", ""),
                }
        index += 1
    if not out:
        print("কোনো /tmp/commons-meta-*.json পাওয়া যায়নি — আগে API রেসপন্স সংরক্ষণ করুন।", file=sys.stderr)
        sys.exit(1)
    return out


def cmd_apply() -> None:
    meta = load_meta()

    with open(IMAGES_TS, encoding="utf-8") as fh:
        images_text = fh.read()
    with open(LICENSES_TS, encoding="utf-8") as fh:
        lic_text = fh.read()

    have_images = set(re.findall(r"slug: '([^']*)'", images_text))
    have_lic = set(re.findall(r"file: '([^']*)'", lic_text))

    added_images, added_lic, skipped, missing = [], [], [], []

    for slug, name, url, confidence in ROWS:
        if slug in have_images:
            skipped.append(slug)
        else:
            # §12 — লেখক/লাইসেন্স না পেলে "যাচাই বাকি"; কল্পিত ক্রেডিট নয়।
            info = meta.get(name, {})
            credit = clean_html(info.get("artist", ""))
            license_name = (info.get("license") or "").strip()
            verified = bool(license_name) and (bool(credit) or license_name in NO_CREDIT_REQUIRED)
            if not license_name:
                license_name = "যাচাই বাকি"
                missing.append(slug)
            note = (
                "উইকিমিডিয়া কমন্সে প্রকাশিত উন্মুক্ত-লাইসেন্স ছবি। কমন্স API (extmetadata) "
                "থেকে লেখক ও লাইসেন্স যাচাই করা হয়েছে (ব্যাচ %s)।" % BATCH
                if verified
                else "উইকিমিডিয়া কমন্সে প্রকাশিত উন্মুক্ত-লাইসেন্স ছবি। মূল ফটোগ্রাফারের নাম ও "
                "সুনির্দিষ্ট লাইসেন্স প্রকাশের আগে যাচাই করতে হবে।"
            )
            block = "\n".join([
                "  {",
                "    slug: '%s'," % esc(slug),
                "    file: '%s'," % esc(url),
                "    subject: '%s'," % esc(BN.get(slug, slug)),
                "    source: '%s'," % esc(file_page(name)),
                "    site: 'উইকিমিডিয়া কমন্স',",
                "    confidence: '%s'," % confidence,
                "    lowRes: false,",
                "    license: '%s'," % esc(license_name),
                "    verified: %s," % ("true" if verified else "false"),
                "    note: '%s'," % esc(note),
                "  },",
            ])
            images_text = images_text.replace("\n]\n\nexport const SEED_IMAGE_BY_SLUG", "\n" + block + "\n]\n\nexport const SEED_IMAGE_BY_SLUG")
            have_images.add(slug)
            added_images.append(slug)

        if url in have_lic:
            continue
        info = meta.get(name, {})
        credit = clean_html(info.get("artist", ""))
        license_name = (info.get("license") or "").strip()
        verified = bool(license_name) and (bool(credit) or license_name in NO_CREDIT_REQUIRED)
        license_url = LICENSE_URLS.get(license_name, "")
        if not license_name:
            license_name = "যাচাই বাকি"
        lines = [
            "  {",
            "    file: '%s'," % esc(url),
            "    subject: '%s'," % esc(BN.get(slug, slug)),
            "    slug: '%s'," % esc(slug),
            "    kind: 'image',",
            "    credit: '%s'," % esc(credit),
            "    source: '%s'," % esc(file_page(name)),
            "    license: '%s'," % esc(license_name),
        ]
        if license_url:
            lines.append("    licenseUrl: '%s'," % esc(license_url))
        note_bn = (
            "Wikimedia Commons API (extmetadata) দিয়ে লেখক ও লাইসেন্স যাচাই করা হয়েছে (ব্যাচ %s)।" % BATCH
            if verified
            else "উইকিমিডিয়া কমন্সে প্রকাশিত উন্মুক্ত-লাইসেন্স ছবি। মূল ফটোগ্রাফারের নাম ও সুনির্দিষ্ট লাইসেন্স প্রকাশের আগে যাচাই করতে হবে।"
        )
        lines += [
            "    verified: %s," % ("true" if verified else "false"),
            "    note: '%s'," % esc(note_bn),
            "  },",
        ]
        block = "\n".join(lines)
        marker = "\n]\n\nexport function licenseFor"
        lic_text = lic_text.replace(marker, "\n" + block + marker)
        have_lic.add(url)
        added_lic.append(slug)

    with open(IMAGES_TS, "w", encoding="utf-8") as fh:
        fh.write(images_text)
    with open(LICENSES_TS, "w", encoding="utf-8") as fh:
        fh.write(lic_text)

    print(json.dumps({
        "rows": len(ROWS),
        "imagesAdded": len(added_images),
        "licensesAdded": len(added_lic),
        "skippedExisting": len(skipped),
        "pendingVerification": missing,
    }, ensure_ascii=False, indent=2))


def main() -> None:
    args = sys.argv[1:]
    if args and args[0] == "--titles":
        cmd_titles()
    elif args and args[0] == "--apply":
        cmd_apply()
    else:
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
