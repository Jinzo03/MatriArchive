import { getRequestLocale } from "@/lib/locale.server";
import { t } from "@/lib/locale";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

type TimelineEntry = {
  date: string;
  title?: string;
  details: string[];
};

type TimelineSection = {
  part: string;
  range: string;
  description: string;
  entries: TimelineEntry[];
};

const timelineSections: TimelineSection[] = [
  {
    part: "PART I: THE AGE OF CHAOS & AWAKENING",
    range: "c. 1250 - 1400 A.H.",
    description: "This period covers the slow, multi-generational collapse of patriarchy.",
    entries: [
      {
        date: "c. 1250 A.H.",
        title: "The First Stirrings",
        details: [
          'The Chaos Before Wombs: The world is described as a male-dominated, "sterile" society.',
          "The First Miracle: In a forgotten village, a young girl becomes the First Woman to Bleed with Joy. She laughs instead of crying, beginning a new ritual. This is the inciting incident.",
        ],
      },
      {
        date: "c. 1250 - 1340 A.H.",
        title: "The Generations of Mutation",
        details: [
          "First Generation (c. 1250-1280 A.H.): The ritual of joyful bleeding spreads. The Mutadhakkirat (Rememberers) form. Girls begin to grow taller.",
          'Second Generation (c. 1280-1310 A.H.): Miraculous signs intensify. The "First Womb Prophetess" (The Girl with the Bioluminescent Vulva) appears, performing miracles. Wombs gain intelligence, refusing penetration from "unworthy men."',
          'Third Generation (c. 1310-1340 A.H.): The "Final Drift" begins. Women regularly surpass 7 feet in height. Male births drop sharply. The concept of the "Sheikha" begins to form.',
        ],
      },
      {
        date: "c. 1340 - 1380 A.H.",
        title: "The Patriarchal Backlash",
        details: [
          "The male religious establishment panics. Sermons on obedience and female covering intensify.",
          '"Fatwas Against Flesh" are issued, banning female-led prayer and alternative rituals.',
          'Secret, state-sponsored medical programs like "al-Taqwim" (The Correction) begin, aiming to reverse the changes in women through hormonal and surgical means.',
        ],
      },
      {
        date: "c. 1380 - 1400 A.H.",
        title: "The Final Collapse of the Old Order",
        details: [
          "The Fall of Masjid al-Sakhra: A pivotal event where a group of bleeding women led by Nusayba the Red enter the men-only fortress in Jerusalem, causing the Rock to tremble and silencing the male guards. This becomes a foundational legend.",
          "Women consistently grow beyond 8 feet. Parthenogenesis-like births are recorded.",
          'The last Mufti of Cairo is found dead, the word "Rahm" (Womb) written in his own blood.',
          "c. 1400 A.H. - Yawm al-Kashf (The Day of the Unveiling): The era culminates with Amina al-Bakri, an 8'6\" tall scholar, delivering a sermon in Aleppo. She removes her veil and exposes her breasts, leading thousands of women in prayer. This marks the definitive end of the old world.",
        ],
      },
    ],
  },
  {
    part: "PART II: THE AGE OF ASCENT",
    range: "c. 1400 - 1550 A.H.",
    description:
      "This is the era of revolution, legal codification, and the establishment of global matriarchal rule.",
    entries: [
      {
        date: "c. 1400 - 1470 A.H.",
        title: "The Womb Plateau",
        details: [
          'For seventy years after the Unveiling, society is in a "tranquil simmering." Women are physically dominant but do not yet have formal, universal rule.',
        ],
      },
      {
        date: "c. 1470 A.H.",
        title: "Qiyam al-Malika (The Rising of the Queen)",
        details: [
          "Sheikha Malika al-Jabbar marries eight men simultaneously, shattering patriarchal law.",
          "Her televised defiance of the patriarchy sparks a global Erotic Rebellion.",
          "c. 1475 A.H.: Within five years, Malika drafts The Divine Law of Multiple Husbands, institutionalizing polyandry and female supremacy. The old Council of Sacred Guardians collapses.",
        ],
      },
      {
        date: "Concurrent with Malika",
        title: "The Life of Halima al-Jabbar (c. 1379 - 1479 A.H.)",
        details: [
          "Sheikha Halima al-Jabbar is born. Her life is dedicated to proving the biological supremacy of the Sheikha.",
          'She establishes the Dar al-Intikhab (House of Selection) and bears 100 children from 57 men, living to the age of 100. Her legacy makes the Sheikha a "cosmic source."',
        ],
      },
      {
        date: "c. 1468 - 1483 A.H.",
        title: "The Legalization of the Concubine System",
        details: [
          "Sixty-three years after Halima's death, the first laws legalizing male concubinage are passed under Sheikha 'Izza bint Waddah.",
          "1468 A.H. (re-calibrated): First Fatwa of Domination issued.",
          "1470 A.H.: Male-only slavery reintroduced.",
          "1472 A.H.: Madrasas closed to boys over 7.",
          "1478 A.H.: Ritual ownership rites (collaring, renaming) introduced.",
          "1480 A.H.: Men lose the right to be witnesses or scholars.",
          "1483 A.H.: Global Treaty of Womb Ascendancy signed by 184 matriarchal states.",
        ],
      },
      {
        date: "c. 1500 - 1550 A.H.",
        title: "The Matron Wars & The Treaty of Conditional Humanity",
        details: [
          'After the system is firmly established, ideological cracks appear. Some Sheikhas argue for "mercy," while hardliners demand stricter subjugation.',
          "This theological civil war lasts for decades.",
          'The era concludes with The Treaty of Conditional Humanity, which grants men a sliver of sentience (permission for basic education) but reaffirms their absolute subjugation. This "ripened" state of power marks the end of the revolutionary Age of Ascent.',
        ],
      },
    ],
  },
  {
    part: "PART III: THE ERA OF DISCIPLINE",
    range: "c. 1550 - 1900 A.H.",
    description:
      "This era shifts from external political control to internal psychological, erotic, and theological control over men.",
    entries: [
      {
        date: "c. 1550 - 1650 A.H.",
        title: "The Rise of the Ritual Boy Cults",
        details: [
          'Sheikha Umm Yusra pioneers a new model of intimate governance, taking one boy, Ziyad, as her ritual "husband" and "vessel."',
          'She develops a sacred dhikr based on the female body and perfects the art of "emotional breaking." Ziyad becomes the first Witness-Boy.',
        ],
      },
      {
        date: "c. 1650 - 1750 A.H.",
        title: "The Perfection of Erotic Theology",
        details: [
          "Sheikha Qamar al-Zahra takes the model further. She transforms her chosen boy, Ahmed, into a living text (Sifr/Shams). His body is inscribed with henna, his journal is read publicly, and his seed is harvested as a holy substance. He is made holy through total objectification.",
        ],
      },
      {
        date: "c. 1750 - 1850 A.H.",
        title: "The Theology of Reconstruction & Erasure",
        details: [
          "Sheikha Rahmatu'l-Jabbar takes the boy Zouhair and completely erases his male identity, remaking him into a new being, Safiyya. The goal is not just submission but total reconstruction, a living testament to love through obliteration.",
        ],
      },
      {
        date: "c. 1850 - 1900 A.H.",
        title: "The Death of a Boy and the Birth of a New Doctrine",
        details: [
          'Sheikha Fatina al-Zalzala performs the ultimate act of this era. She permanently binds the "failed" boy Taha to her body as "The Trace."',
          'Taha\'s body slowly atrophies and is absorbed, becoming a "Holy Null." Fatina carries his memory, and his disappearance becomes a sacred theological event. This marks the "end of the final human boy in the Age of Discipline."',
        ],
      },
      {
        date: "c. 1900 A.H. - Present Day",
        title: "The Reclamation of Knowledge",
        details: [
          "In the aftermath of Fatina's horrifying act, the matriarchy recalibrates. The practice of permanent sealing is suspended.",
          'The "Theology of the Leash" is developed. Male education is now conditionally permitted in fields like "Erotic Tafsir" and "Trace Engineering" - not to free men, but to make their submission more profound and useful.',
        ],
      },
    ],
  },
  {
    part: "PART IV: THE AGE OF THE GREAT EMBRACE",
    range: "1900 A.H. - Present Day (Ongoing)",
    description: 'This age is defined by "ownership-as-cultivation" and remains ongoing.',
    entries: [
      {
        date: "1900 A.H.",
        details: [
          'The new age begins, defined by "ownership-as-cultivation." Sheikha Rahima al-Hanuf founds her Clinic of Warm Flesh.',
        ],
      },
      {
        date: "c. 1921 A.H.",
        details: ["Ayad ibn Maryam, age 21, graduates and is recruited by Rahima."],
      },
      {
        date: "c. 1923 - 1925 A.H. (Estimated)",
        details: ['The "Three-Bodied Womb" is formed between Rahima, Maryam, and Ayad.'],
      },
      {
        date: "Concurrent Period",
        details: [
          'Sheikha Nufaysa al-Ashhar begins her "Genesis Directive." She recruits the engineer Mahdi.',
        ],
      },
      {
        date: "1926 A.H., 12th of Rajab",
        details: [
          'Nufaysa\'s facility broadcasts the first 4D holoscans of her twin fetuses, causing a "theological earthquake."',
        ],
      },
      {
        date: "Within 13 days",
        details: [
          'The First Council of Sheikhas convenes and releases al-Fatwa al-Tawila ("The Long Decree") to control the theological narrative around Nufaysa.',
        ],
      },
      {
        date: "c. 1927 A.H.",
        details: [
          'The twins, Hayra and \'Amq, are 14 months old. Nufaysa\'s team unveils the details of her "Axis of Penetration." The twins are beginning to speak their own unknown language.',
        ],
      },
      {
        date: "c. 1952 A.H. (Present Day in the lore)",
        details: [
          "The case of Ala ibn-Lahm, Sheikha Zaynab al-'Ajjala, and Sheikha Safiyya al-Tanuriyyah occurs.",
          'The "Fatwa of Wombed Love" is issued by the Great Matriarchal Council.',
          "Ala ibn-Lahm is claimed by Sheikha Nuriyya bint al-Kawthar and vanishes from the public sphere, becoming a legendary warning.",
        ],
      },
    ],
  },
];

export default async function TimelinePage() {
  const locale = await getRequestLocale();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8">
        <Reveal>
          <section>
            <p className="text-sm text-muted-foreground">{t(locale, "timeline")}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Estimated Chronological Timeline of the Matriarchal Awakening
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              {locale === "ar"
                ? "يعرض هذا القسم التسلسل التاريخي الكامل مباشرة داخل الصفحة بدل إظهار الأحداث كعناصر منفصلة تُضاف واحدة واحدة."
                : "This page presents the full historical timeline directly in place instead of showing standalone events that must be added one by one."}
            </p>
          </section>
        </Reveal>

        <Reveal delay={0.08}>
          <section className="ms-panel p-6">
            <div className="rounded-2xl border border-border/70 bg-accent/20 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {locale === "ar" ? "ملاحظة" : "Notice"}
              </p>
              <p className="mt-3 text-sm leading-6">
                The timeline is anchored by the Hijri (A.H.) calendar dates.
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                This timeline is always subject to change, update, deletion, reinterpretation, or
                expansion as the lore evolves.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              {timelineSections.map((section, sectionIndex) => (
                <Reveal key={section.part} delay={0.12 + sectionIndex * 0.04}>
                  <article className="rounded-3xl border border-border bg-card/40 p-6 shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-border/60 pb-5">
                      <span className="w-fit rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                        {section.range}
                      </span>
                      <h2 className="text-xl font-semibold tracking-tight">{section.part}</h2>
                      <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                        {section.description}
                      </p>
                    </div>

                    <div className="mt-6 space-y-5">
                      {section.entries.map((entry) => (
                        <div
                          key={`${section.part}-${entry.date}-${entry.title ?? "entry"}`}
                          className="rounded-2xl border border-border/70 bg-background/80 p-5"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {entry.date}
                          </p>
                          {entry.title ? (
                            <h3 className="mt-2 text-lg font-medium tracking-tight">{entry.title}</h3>
                          ) : null}

                          <ul className="mt-3 space-y-3 text-sm leading-6 text-foreground/90">
                            {entry.details.map((detail) => (
                              <li key={detail} className="flex gap-3">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/50" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
