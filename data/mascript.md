	modified:   src/lib/components/SuicideRisk.svelte
	modified:   src/lib/components/TimelineView.svelte
	modified:   src/lib/components/TreatmentAccessIndex.svelte
	modified:   src/lib/components/TrendLine.svelte
	modified:   src/lib/components/WealthVsWellbeing.svelte
	modified:   src/lib/components/WorldMap.svelte
	modified:   src/lib/i18n/index.ts
	modified:   src/lib/i18n/locales/en.json
	modified:   src/lib/i18n/locales/hi.json
	modified:   src/lib/i18n/locales/ne.json

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	src/lib/__tests__/i18n.test.ts
	src/lib/i18n/locales/response-1.json

no changes added to commit (use "git add" and/or "git commit -a")
puskarwagle@wagle ~/wagle/adhd/graphicsForADHD $ git status
On branch feature/collections
Your branch is up to date with 'origin/feature/collections'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	src/lib/i18n/locales/response-1.json

nothing added to commit but untracked files present (use "git add" to track)
puskarwagle@wagle ~/wagle/adhd/graphicsForADHD $ rm src/lib/i18n/locales/response-1.json
puskarwagle@wagle ~/wagle/adhd/graphicsForADHD $ clear
puskarwagle@wagle ~/wagle/adhd/graphicsForADHD $ ls
AGENTS.md         docs              package-lock.json scripts           tsconfig.json
bun.lock          eslint.config.js  package.json      src               vite.config.ts
data              node_modules      README.md         static            vitest.config.ts
puskarwagle@wagle ~/wagle/adhd/graphicsForADHD $ git status
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
puskarwagle@wagle ~/wagle/adhd/graphicsForADHD $ bun run dev
$ vite dev

  VITE v8.1.3  ready in 960 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
(node:77062) ExperimentalWarning: localStorage is not available because --localstorage-file was not provided.
(Use `node --trace-warnings ...` to show where the warning was created)
2:47:23 pm [vite] (client) hmr update /src/routes/+page.svelte
2:47:23 pm [vite] (ssr) page reload src/routes/+page.svelte
2:47:40 pm [vite] (client) hmr update /src/lib/components/CustomPage.svelte
2:47:40 pm [vite] (ssr) page reload src/lib/components/CustomPage.svelte
2:47:46 pm [vite] (client) hmr update /src/lib/components/CustomPagePreview.svelte
2:47:46 pm [vite] (ssr) page reload src/lib/components/CustomPagePreview.svelte
2:48:59 pm [vite] (client) hmr update /src/lib/components/CustomPage.svelte
2:48:59 pm [vite] (ssr) page reload src/lib/components/CustomPage.svelte
2:49:47 pm [vite] (client) hmr update /src/routes/+page.svelte
2:49:47 pm [vite] (ssr) page reload src/routes/+page.svelte
2:49:55 pm [vite] (ssr) page reload src/routes/+page.svelte (x2)
2:50:03 pm [vite] (ssr) page reload src/routes/+page.svelte (x3)
2:52:01 pm [vite] (ssr) page reload src/routes/+page.svelte (x4)
2:52:13 pm [vite] (ssr) page reload src/lib/Settings.svelte
2:52:18 pm [vite] (ssr) page reload src/lib/components/DataExplorer.svelte
2:52:51 pm [vite] (ssr) page reload src/lib/components/StatsView.svelte
2:52:59 pm [vite] (ssr) page reload src/lib/components/WorldMap.svelte
2:53:14 pm [vite] (client) hmr update /src/lib/components/PrisonPrevalence.svelte
2:53:14 pm [vite] (ssr) page reload src/lib/components/PrisonPrevalence.svelte
2:53:23 pm [vite] (ssr) page reload src/lib/components/PrisonPrevalence.svelte (x2)
2:53:30 pm [vite] (client) hmr update /src/lib/components/SUDbySubstance.svelte
2:53:30 pm [vite] (ssr) page reload src/lib/components/SUDbySubstance.svelte
2:53:39 pm [vite] (ssr) page reload src/lib/components/SUDbySubstance.svelte (x2)
2:53:45 pm [vite] (ssr) page reload src/lib/components/SDIScatter.svelte
2:53:51 pm [vite] (ssr) page reload src/lib/components/SDIScatter.svelte (x2)
2:53:56 pm [vite] (ssr) page reload src/lib/components/WealthVsWellbeing.svelte
2:54:21 pm [vite] (client) hmr update /src/lib/components/MentalHealthWorldMap.svelte, /src/lib/components/WealthVsWellbeing.svelte, /src/lib/components/TreatmentAccessIndex.svelte, /src/lib/components/PrisonMentalHealthLink.svelte, /src/lib/components/EducationPressure.svelte, /src/lib/components/HappinessRankings.svelte, /src/lib/components/HDIExplorer.svelte, /src/lib/components/GovernanceRadar.svelte, /src/lib/components/GlobalHealthTrends.svelte, /src/lib/components/EconomicSnapshot.svelte, /src/lib/components/WorldMap.svelte and 11 more
2:54:21 pm [vite] (ssr) page reload src/lib/data.ts
2:54:28 pm [vite] (client) hmr update /src/lib/components/MentalHealthWorldMap.svelte, /src/lib/components/WealthVsWellbeing.svelte, /src/lib/components/TreatmentAccessIndex.svelte, /src/lib/components/PrisonMentalHealthLink.svelte, /src/lib/components/EducationPressure.svelte, /src/lib/components/HappinessRankings.svelte, /src/lib/components/HDIExplorer.svelte, /src/lib/components/GovernanceRadar.svelte, /src/lib/components/GlobalHealthTrends.svelte, /src/lib/components/EconomicSnapshot.svelte, /src/lib/components/WorldMap.svelte and 11 more
2:54:28 pm [vite] (ssr) page reload src/lib/data.ts
2:54:34 pm [vite] (client) hmr update /src/lib/components/WorldMap.svelte, /src/lib/components/MentalHealthWorldMap.svelte, /src/lib/components/WealthVsWellbeing.svelte, /src/lib/components/TreatmentAccessIndex.svelte, /src/lib/components/PrisonMentalHealthLink.svelte, /src/lib/components/EducationPressure.svelte, /src/lib/components/HappinessRankings.svelte, /src/lib/components/HDIExplorer.svelte, /src/lib/components/GovernanceRadar.svelte, /src/lib/components/GlobalHealthTrends.svelte, /src/lib/components/EconomicSnapshot.svelte and 11 more
2:54:34 pm [vite] (ssr) page reload src/lib/mapData.ts
2:54:43 pm [vite] (client) hmr update /src/lib/components/WorldMap.svelte, /src/lib/components/MentalHealthWorldMap.svelte, /src/lib/components/WealthVsWellbeing.svelte, /src/lib/components/TreatmentAccessIndex.svelte, /src/lib/components/PrisonMentalHealthLink.svelte, /src/lib/components/EducationPressure.svelte, /src/lib/components/HappinessRankings.svelte, /src/lib/components/HDIExplorer.svelte, /src/lib/components/GovernanceRadar.svelte, /src/lib/components/GlobalHealthTrends.svelte, /src/lib/components/EconomicSnapshot.svelte and 11 more
2:54:43 pm [vite] (ssr) page reload src/lib/mapData.ts
2:54:48 pm [vite] (ssr) page reload src/lib/components/HDIExplorer.svelte
2:54:57 pm [vite] (client) hmr update /src/lib/components/TreatmentAccessIndex.svelte
2:54:57 pm [vite] (ssr) page reload src/lib/components/TreatmentAccessIndex.svelte
2:56:32 pm [vite] (client) page reload .svelte-kit/generated/client/nodes/0.js
2:56:32 pm [vite] (client) page reload .svelte-kit/generated/client/nodes/1.js
2:56:32 pm [vite] (client) page reload .svelte-kit/generated/client/nodes/2.js
2:56:32 pm [vite] (client) page reload .svelte-kit/generated/client/app.js
2:56:32 pm [vite] (client) page reload .svelte-kit/generated/client/matchers.js
2:56:32 pm [vite] (ssr) page reload .svelte-kit/generated/shared/error-template.js
2:56:32 pm [vite] (ssr) page reload .svelte-kit/generated/server/internal.js
2:56:32 pm [vite] (client) page reload .svelte-kit/generated/root.js
2:56:32 pm [vite] (ssr) page reload .svelte-kit/generated/root.js (x2)
2:56:32 pm [vite] (ssr) page reload .svelte-kit/generated/root.svelte
2:56:53 pm [vite] (client) page reload .svelte-kit/generated/client/nodes/0.js
2:56:53 pm [vite] (client) page reload .svelte-kit/generated/client/nodes/1.js
2:56:53 pm [vite] (client) page reload .svelte-kit/generated/client/nodes/2.js
2:56:53 pm [vite] (client) page reload .svelte-kit/generated/client/app.js
2:56:53 pm [vite] (client) page reload .svelte-kit/generated/client/matchers.js
2:56:53 pm [vite] (ssr) page reload .svelte-kit/generated/shared/error-template.js
2:56:53 pm [vite] (ssr) page reload .svelte-kit/generated/server/internal.js
2:56:53 pm [vite] (client) page reload .svelte-kit/generated/root.js
2:56:53 pm [vite] (ssr) page reload .svelte-kit/generated/root.js (x2)
2:56:53 pm [vite] (ssr) page reload .svelte-kit/generated/root.svelte
2:57:33 pm [vite] (client) page reload .svelte-kit/generated/client/nodes/0.js
2:57:33 pm [vite] (client) page reload .svelte-kit/generated/client/nodes/1.js
2:57:33 pm [vite] (client) page reload .svelte-kit/generated/client/nodes/2.js
2:57:33 pm [vite] (client) page reload .svelte-kit/generated/client/app.js
2:57:33 pm [vite] (client) page reload .svelte-kit/generated/client/matchers.js
2:57:33 pm [vite] (ssr) page reload .svelte-kit/generated/shared/error-template.js
2:57:33 pm [vite] (ssr) page reload .svelte-kit/generated/server/internal.js
2:57:33 pm [vite] (client) page reload .svelte-kit/generated/root.js
2:57:33 pm [vite] (ssr) page reload .svelte-kit/generated/root.js (x2)
2:57:33 pm [vite] (ssr) page reload .svelte-kit/generated/root.svelte
2:58:20 pm [vite] (client) page reload .svelte-kit/generated/client/nodes/0.js
2:58:20 pm [vite] (client) page reload .svelte-kit/generated/client/nodes/1.js
2:58:20 pm [vite] (client) page reload .svelte-kit/generated/client/nodes/2.js
2:58:20 pm [vite] (client) page reload .svelte-kit/generated/client/app.js
2:58:20 pm [vite] (client) page reload .svelte-kit/generated/client/matchers.js
2:58:20 pm [vite] (ssr) page reload .svelte-kit/generated/shared/error-template.js
2:58:20 pm [vite] (ssr) page reload .svelte-kit/generated/server/internal.js
2:58:20 pm [vite] (client) page reload .svelte-kit/generated/root.js
2:58:20 pm [vite] (ssr) page reload .svelte-kit/generated/root.js (x2)
431 Demontis, D. et al. (2019; 2023). Genome-wide association studies of ADHD. Nature Genetics.
432 Brain structure and networks                                                                                 433                                                                                                              434 Shaw, P. et al. (2007). Attention-deficit/hyperactivity disorder is characterized by a delay in cortical matu
435 Hoogman, M. et al. (2017). Subcortical brain volume differences in ADHD (ENIGMA). Lancet Psychiatry.         436 Sonuga-Barke, E. and Castellanos, F.X. (2007). Spontaneous attentional fluctuations in impaired states and pa437 Cortese, S. et al. (2012). Toward systems neuroscience of ADHD: a meta-analysis of 55 fMRI studies. American
438 Neurochemistry and imaging                                                                                   439                                                                                                              440 Zametkin, A.J. et al. (1990). Cerebral glucose metabolism in adults with hyperactivity of childhood onset. Ne
441 Volkow, N.D. et al. (2009). Evaluating dopamine reward pathway in ADHD. JAMA.                                442 Volkow, N.D. et al. (2011). Motivation deficit in ADHD is associated with dysfunction of the dopamine reward 443 Volkow, N.D. et al. (1998). Dopamine transporter occupancies in the human brain induced by therapeutic doses
444 Arnsten, A.F.T. (various). Catecholamine influences on prefrontal cortical function (inverted-U model).      445 Bymaster, F.P. et al. (2002). Atomoxetine increases extracellular levels of norepinephrine and dopamine in pr446 History and prevalence
447                                                                                                              448 Crichton, A. (1798). An Inquiry into the Nature and Origin of Mental Derangement.                            449 Still, G.F. (1902). Some abnormal psychical conditions in children (Goulstonian Lectures). The Lancet.
450 Polanczyk, G. et al. (2007). The worldwide prevalence of ADHD: a systematic review and metaregression analysi451 American Psychiatric Association. DSM-5 and DSM-5-TR (2013; 2022). WHO ICD-11.                               452 Nepal
453                                                                                                              454 Clinico-demographic profile of children and adolescents with ADHD presenting to a tertiary care centre (Kanti455 Rimal, H.S. and Pokharel, A. (2016). Prevalence of ADHD among school children and associated co-morbidities:
456 Nepal ADHD scale development and validation study (2018), Nepal Health Research Council.                     mascript.md (456,89) | ft:markdown | unix | utf-8                                   Alt-g: bindings, Ctrl-g: helpSaved mascript.md
  1 ADHD Is Real: The Ancient, Misunderstood Brain
  2 Full YouTube script for a Nepali audience. Estimated runtime: 35 to 40 minutes.
  3
  4 Alternate title ideas: "It's Not Laziness: The Science of ADHD" / "ADHD: A Brain Built for a Different World"
  5
  6 How to read this script: anything between three asterisks and spaces, like *** this ***, is a key term or a c
  7
  8 CHAPTER 1: COLD OPEN (0:00 to 2:30)
  9 *** VISUAL: The famous "March of Progress" illustration. A chimpanzee on the left, then a line of ape-like an
 10
 11 You have seen this picture. In textbooks, in memes, on t-shirts, maybe on the wall of your school science lab
 12
 13 It is one of the most famous images in the history of science.
 14
 15 And it is wrong.
 16
 17 *** VISUAL: A red cross slams over the image. ***
 18
 19 Not a little wrong. Wrong about how evolution actually works. And that mistake matters for today's story, bec
 20
 21 *** VISUAL: Fast montage. A Nepali classroom. A parent scolding a child. An office worker staring out of a wi
 22
 23 If you have ever been called *** aalasi *** (lazy), *** jiddi *** (stubborn), or *** bigreko *** (spoiled)...
 24
 25 This video is for you.
 26
mascript.md (1,1) | ft:markdown | unix | utf-8                                      Alt-g: bindings, Ctrl-g: help
ADHD Is Real: The Ancient, Misunderstood Brain
Full YouTube script for a Nepali audience. Estimated runtime: 35 to 40 minutes.

Alternate title ideas: "It's Not Laziness: The Science of ADHD" / "ADHD: A Brain Built for a Different World" / "Aalasi? Jiddi? The Truth About ADHD in Nepal"

How to read this script: anything between three asterisks and spaces, like *** this ***, is a key term or a cue for an image, graphic, animation or B-roll. Lines that begin with *** VISUAL: are standalone visual cues. Everything else is narration.

CHAPTER 1: COLD OPEN (0:00 to 2:30)
*** VISUAL: The famous "March of Progress" illustration. A chimpanzee on the left, then a line of ape-like ancestors walking to the right, ending with a modern human. ***

You have seen this picture. In textbooks, in memes, on t-shirts, maybe on the wall of your school science lab. A chimpanzee slowly stands up, straightens his back, and becomes a man.

It is one of the most famous images in the history of science.

And it is wrong.

*** VISUAL: A red cross slams over the image. ***

Not a little wrong. Wrong about how evolution actually works. And that mistake matters for today's story, because the same "straight line" thinking that misleads us about evolution also misleads us about human brains. It gives us the idea that there is one correct, finished, normal brain, and that everyone who differs from it is a broken copy.

*** VISUAL: Fast montage. A Nepali classroom. A parent scolding a child. An office worker staring out of a window. A teenager with a phone, restless leg bouncing. ***

If you have ever been called *** aalasi *** (lazy), *** jiddi *** (stubborn), or *** bigreko *** (spoiled)... if a teacher wrote "does not pay attention" on your report card every single year... if your parents said "tero dimag chha, tara mehnat gardainas" (you have a brain, but you don't work hard)... if you are a parent who has heard "it's your parenting" one too many times...

This video is for you.

Over the next half hour we will travel through evolutionary history, inside the living brain, down to the molecules that pass between two neurons, and back to a hospital in Kathmandu. By the end, I want you to understand one thing with certainty:

*** ADHD *** is not an excuse. It is not bad manners. It is not a Western invention. It is a real, measurable, heritable difference in how the brain develops and regulates attention, activity and impulses. And it has been described by doctors for more than two hundred years.

Let's begin with that picture.

CHAPTER 2: EVOLUTION IS NOT A LADDER (2:30 to 6:00)
*** VISUAL: Animated split. On the left, a straight ladder labeled "Common myth." On the right, a sprawling branching tree labeled "Reality." ***

First, the correction. Humans did not come from chimpanzees. Chimpanzees are not our grandparents. They are our *** cousins ***.

*** VISUAL: Family tree animation. Humans and chimpanzees branching from a single point labeled "Last common ancestor, roughly 6 to 7 million years ago." ***

Roughly six to seven million years ago, there lived a species that was the ancestor of both chimpanzees and humans. Its descendants split into different populations. One branch led to modern chimpanzees. Another led to us. Both branches have been evolving, changing, for the same amount of time.

*** VISUAL: A "bush" diagram of hominin species: Homo erectus, Neanderthals, Denisovans, Homo naledi, Homo floresiensis, Homo sapiens, overlapping in time. ***

And our own branch was never a single line either. At various points in the last few hundred thousand years, several human species lived on Earth at the same time. Neanderthals. Denisovans. Homo erectus. Small-bodied humans in Indonesia. All of them were "human." Only one lineage survived.

So how does evolution really work? Not on individuals, and not toward a goal. It works on *** populations *** and on *** variation ***.

*** VISUAL: A crowd of animated stick figures, each slightly different in height, skin tone, and colored dots representing different traits. ***

Inside any population, people differ. Some are taller, some shorter. Some are cautious, some are bold. Some have brains that love routine, and some have brains that crave novelty. This variation is the raw material of evolution. When the environment changes, a trait that was useless yesterday can suddenly be valuable, and a trait that was valuable can become a burden.

Nature does not build one perfect brain. It builds a diverse population of brains, because nobody knows what tomorrow will demand.

Keep that sentence in mind. Because it leads us to one of the most fascinating ideas about ADHD.

CHAPTER 3: THE HUNTER AND THE FARMER (6:00 to 11:30)
*** VISUAL: Split screen. A hunter-gatherer scanning a forest. A farmer patiently tending a terraced field in the Nepali hills. ***

For more than 95 percent of the history of our species, humans were *** hunter-gatherers ***. Farming began only about 10 to 12 thousand years ago. Factories and offices are barely 250 years old. Compulsory mass schooling is younger still.

*** VISUAL: A 24-hour clock. Hunter-gatherer life fills 23 hours and 45 minutes. Agriculture and everything after is the final few minutes. ***

Think of the whole history of Homo sapiens as one day. Hunting and foraging fill nearly the entire day. Farming appears in the last hour. The classroom and the office cubicle arrive in the last few minutes.

*** VISUAL: Book cover of Thom Hartmann's "Attention Deficit Disorder: A Different Perception," 1993. ***

In the 1990s, an American author and therapist named *** Thom Hartmann ***, who himself had ADHD and whose son had been diagnosed, proposed what he called the *** Hunter versus Farmer hypothesis ***.

His idea was this. Imagine two kinds of minds in a prehistoric community.

The farmer's mind is patient. It notices routine. It can do the same task steadily for hours, wait for a harvest, and follow a plan. Wonderful for growing crops.

The hunter's mind is different. It is always scanning. A rustle in the grass, a shift in the wind, a shadow at the edge of vision, it notices everything. It reacts fast. It gets bored by repetition but becomes intensely locked in when the prey appears. It takes risks. It goes searching for new places when the old ones run dry.

*** VISUAL: Animated "attention" spotlight. For the farmer, a steady narrow beam on one crop row. For the hunter, a wide, constantly swinging beam that suddenly narrows into a tight focus on a deer. ***

Hartmann noticed that this hunter profile looks a lot like the ADHD profile: high alertness, novelty-seeking, quick reactions, easy distraction by anything new, and sudden bursts of *** hyperfocus ***.

Now here is where I owe you honesty, because honesty is the whole point of this channel.

The Hunter versus Farmer idea is a *** hypothesis ***, not a proven fact. Hartmann was not a laboratory scientist, and no study has proven that ADHD was "designed" by evolution for hunting. Also, "hyperfocus" is commonly reported by people with ADHD, but it is not an official diagnostic criterion. So please do not walk away thinking "ADHD is a superpower." That is not what the science says.

What the science does say is more interesting.

*** VISUAL: 3D animation of a dopamine receptor embedded in a neuron membrane, with the gene name DRD4 floating above it. ***

Researchers have studied a gene called *** DRD4 ***, which carries the instructions for building one type of *** dopamine receptor ***. This gene comes in different versions. One version, with a longer stretch of repeated DNA, is called the *** DRD4-7R allele ***, meaning the "seven-repeat" version.

Studies have linked this version to *** novelty-seeking *** and to a modestly higher chance of ADHD. Let me be clear: the effect is small, and plenty of people with 7R do not have ADHD. ADHD involves hundreds or thousands of genetic variants, not one "ADHD gene."

But look at what happened to this allele over time.

*** VISUAL: World map with 7R frequency shading. Low in East Asia, higher in the Americas, with migration arrows out of Africa. ***

In 2002, a team led by Ding and colleagues, published in the journal PNAS, found signs of *** positive selection *** on the 7R allele. That is a statistical fingerprint suggesting that it spread in human populations faster than chance would explain. They estimated it arose tens of thousands of years ago. Another study, by Chen and colleagues in 1999, found that populations whose ancestors migrated farther across the globe tended to carry more of these long DRD4 versions. Explorers, so to speak, carrying explorer genes. Both are interesting patterns, though scientists still debate what exactly they mean.

*** VISUAL: Map of Kenya. Two groups of Ariaal men labeled "Nomadic" and "Settled." ***

Then there is a remarkable real-world test. In 2008, researchers studied the *** Ariaal people *** of northern Kenya, a community in which some families remained nomadic herders while others had settled into village life. Among the nomads, men carrying the 7R allele were better nourished than men without it. Among settled men, the same allele was associated with being worse nourished.

Same gene. Two environments. Opposite outcomes.

*** VISUAL: A bar chart with two contrasting bars, "Nomadic environment: advantage" and "Settled environment: disadvantage." ***

Finally, in 2024, a team at the University of Pennsylvania published a study in Proceedings of the Royal Society B. Volunteers played a computer game that mimicked foraging for berries: stay in a bush and pick, or leave and search for a better bush. People with more ADHD symptoms tended to leave patches sooner. In a world of scarce, shifting resources, this exploring habit can pay off. In a world where you are asked to keep picking from the same bush for eight hours, it looks like "poor concentration."

So the honest summary is this. We cannot prove that ADHD traits were shaped by hunter-gatherer life. But there are real, published, testable clues that the same trait can be a handicap in one environment and an advantage in another. That is the idea of *** evolutionary mismatch ***, and it is where we go next.

CHAPTER 4: THE MODERN MISMATCH (11:30 to 14:00)
*** VISUAL: Time-lapse animation. Forest → farm → factory → school classroom with rows of desks → open-plan office. ***

Now imagine you carry a brain that thrives on movement, novelty and urgent action. And then history changes the rules.

First, agriculture: settle in one place, repeat seasonal tasks. Then the *** Industrial Revolution ***: factory bells, fixed hours, identical tasks, sitting in one place. Then modern schooling: forty-five minutes of sitting, listening, and copying, and then another forty-five, and another.

*** VISUAL: An 1800s factory floor with workers at benches, then cut to a modern Nepali classroom or coaching class ("tuition") with rows of students. ***

For a brain wired for low-stimulation tolerance, this environment is not neutral. It is a daily obstacle course.

And here is a point every doctor and psychologist emphasizes: a difference does not become a disorder just because it is different. Clinically, ADHD is diagnosed only when the traits cause *** significant impairment *** in daily life: failing exams despite high intelligence, losing jobs, accidents, damaged relationships, chronic shame. This is the same logic as any medical condition. Everyone feels sad sometimes, and that is not depression. Everyone forgets keys sometimes, and that is not ADHD. But when it is persistent, severe, present since childhood, and damaging, we have a name for it, and we have a science.

That science starts inside the skull.

CHAPTER 5: THE ADHD BRAIN, REGION BY REGION (14:00 to 20:00)
*** VISUAL: A translucent 3D human head, rotating slowly, with the brain glowing inside. ***

Let's open the brain, in animation, of course. Three systems matter most.

The Prefrontal Cortex: The Conductor
*** VISUAL: Highlight the front of the brain, just behind the forehead. ***

First, the *** Prefrontal Cortex ***, or PFC, the part right behind your forehead. If the brain were an orchestra, the PFC is the conductor. It does not play any single instrument, but it decides who plays when, how loudly, and when to stop.

This region handles what scientists call *** executive functions ***:

*** Working memory ***, holding information in mind, like a phone number you are about to dial. *** Planning and organization ***. *** Impulse control ***, the pause between "I want to say this" and actually saying it. *** Emotional regulation ***. *** Decision-making ***. And sustaining effort on tasks that are not immediately rewarding.

*** VISUAL: Sub-regions labeled: Dorsolateral PFC (planning, working memory), Ventromedial and Orbitofrontal PFC (emotion and reward value), Inferior Frontal Gyrus (braking/stopping), Anterior Cingulate Cortex (error detection and effort). ***

In ADHD, this conductor is under-supported. And we have direct evidence. In 2007, a team at the US National Institute of Mental Health led by Philip Shaw tracked the brain development of more than two hundred children using repeated MRI scans. They found that in children with ADHD, the cerebral cortex followed the normal developmental pattern but arrived late: peak cortical thickness came around 10 and a half years old versus around 7 and a half in typically developing children. The delay was longest in the prefrontal areas. About three years late.

*** VISUAL: Two animated brain "maps" changing color over age, one ahead, one delayed by three years. ***

Three years is not small. In childhood it is the difference between a Grade 2 and a Grade 5 brain.

The good news is that the brain still matures. Many people's symptoms improve in adolescence and adulthood, though for a large share, ADHD persists into adult life.

The Basal Ganglia: Movement and Motivation
*** VISUAL: Zoom deeper, into the center of the brain. Highlight the Basal Ganglia: caudate, putamen, nucleus accumbens, globus pallidus. ***

Deep in the middle of the brain sits a cluster of structures called the *** Basal Ganglia ***. Two of its jobs matter here.

One is *** motor control ***, smoothing and selecting movements, and stopping the ones you do not need. This is part of why the body of a person with ADHD may feel restless or "driven by a motor."

The second is *** reward processing ***, especially in a region called the *** Nucleus Accumbens ***. This is where the brain decides: is this worth my effort? Is this exciting? Is this worth waiting for?

In 2017, the largest brain imaging study of ADHD to that date, by the *** ENIGMA Consortium ***, compared roughly 1,700 people with ADHD to roughly 1,500 without, across many countries. On average, five subcortical regions were slightly smaller in people with ADHD: the nucleus accumbens, the caudate, the putamen, the amygdala and the hippocampus. The differences were small, and strongest in children, which matches the delayed-maturation story.

*** VISUAL: Bar chart showing small but consistent group differences across the five regions, with error bars. ***

I want to be careful here, because trust matters. These are group averages. There is no brain scan that can diagnose a single individual with ADHD today, and anyone selling you one is not being honest. Diagnosis is still done by a trained clinician, through history and interview. But when thousands of scans, from many countries, point in the same direction, that is not imagination. That is a pattern.

The Two Networks: The Switch Problem
*** VISUAL: Two brain network animations side by side, glowing in different colors. ***

The third piece is the most elegant. Your brain runs two major *** networks *** that work like a see-saw.

The *** Default Mode Network ***, or DMN, is your "inner world" network. It lights up when you are daydreaming, remembering, planning your future, thinking about yourself. It is the network of the mind wandering.

The *** Task-Positive Network ***, or TPN, sometimes called the frontoparietal or attention network, lights up when you must focus on an outside task: solving a math problem, reading a page, listening to a lecture.

*** VISUAL: Animated see-saw. When TPN goes up, DMN goes down, and vice versa. ***

In a typical brain, when you start a task, the TPN switches on and the DMN switches down, like lowering the volume of a TV in the background. This "anti-correlation" is what lets you sink into work.

In 2007, researchers Edmund Sonuga-Barke and Francisco Castellanos proposed that in ADHD, the DMN does not turn down fully. It keeps leaking into the task. Imagine studying for the SEE exam while a radio in the next room plays quietly, except the radio is inside your head. Later imaging studies, including a major meta-analysis by Cortese and colleagues in 2012, found reduced activity in attention-related networks and, in some studies, weaker suppression of the DMN.

*** VISUAL: Animated "leak": a faint DMN glow bleeding into the active TPN during a task, causing a flicker labeled "lapse of attention". ***

That is why a person with ADHD can be perfectly intelligent and still lose the thread of a sentence they were just reading. It is not a moral failure. It is a network that is not switching cleanly.

But why would these regions behave differently? For that, we need to zoom in much, much further. Into the chemicals.

CHAPTER 6: THE CHEMICAL MESSENGERS (20:00 to 25:00)
*** VISUAL: Zoom into the brain tissue. Neurons like a glowing forest. Continue zooming until we see a single synapse. ***

Your brain contains around 86 billion neurons. They do not touch each other. Between every two neurons there is a tiny gap, about twenty nanometers wide, called a *** synapse ***.

*** VISUAL: Detailed synapse animation. Presynaptic terminal with vesicles, the gap, postsynaptic receptors, a transporter protein on the presynaptic side. ***

Here is how communication works. An electrical signal reaches the end of one neuron. Little bubbles called *** vesicles *** fuse with the membrane and spill chemicals called *** neurotransmitters *** into the gap. These molecules float across and lock into *** receptors *** on the next neuron, like keys into locks. That passes the message on.

Then the message must end. So special proteins called *** transporters *** act like vacuum cleaners, pulling neurotransmitters back into the first neuron. This is called *** reuptake ***.

Two neurotransmitters are central to ADHD.

Dopamine: The Wanting Molecule
*** VISUAL: Dopamine molecule structure spinning, then a glowing pathway from the midbrain to the striatum and the prefrontal cortex. ***

*** Dopamine *** is often called the "pleasure chemical," but that is only half right. Modern neuroscience shows it is more about wanting: motivation, anticipation, and the feeling of "this matters, go get it." It signals novelty, reward, and importance. It tells your brain: pay attention, this is worth the effort.

When dopamine signaling is strong, boring but necessary tasks still feel doable. When it is weak, the brain shrugs. Only things that are new, urgent, exciting or deeply interesting produce enough signal to get started.

Now you understand something that confuses every parent. "He can play video games for six hours, so why can't he do homework for thirty minutes?" A game is a dopamine machine: novelty, instant feedback, constant reward. Homework offers none of that. It is not that he won't. It is that the system that converts importance into effort is running on low power for boring tasks.

Norepinephrine: The Alertness Molecule
*** VISUAL: A small nucleus in the brainstem labeled Locus Coeruleus, sending branching fibers across the entire brain like a spreading tree. ***

*** Norepinephrine ***, also called noradrenaline, is made mostly in a small brainstem structure called the *** Locus Coeruleus ***. It controls alertness, arousal, and the ability to separate signal from noise. It helps you mobilize effort.

The neuroscientist *** Amy Arnsten *** at Yale has shown that the prefrontal cortex needs these chemicals at just the right level, following what scientists call an *** inverted-U curve ***.

*** VISUAL: Inverted-U graph. X-axis "Neurotransmitter level," Y-axis "PFC performance." Left slope labeled "Too little: drowsy, distracted." Peak labeled "Optimal: focused, calm." Right slope labeled "Too much: stressed, anxious, PFC shuts down." ***

Too little, and you are foggy and distractible. The right amount, and you are sharp. Too much, and stress floods the system, and the prefrontal cortex effectively goes offline. That is why panic destroys thinking, and why ADHD brains can get both bored-and-scattered and overwhelmed-and-frozen.

Why the Signal Is Weak
The leading model, called the *** hypodopaminergic hypothesis ***, suggests that in ADHD, dopamine and norepinephrine signaling in these networks is weaker or less well-regulated. That can happen through fewer receptors, less release, or transporters that clear the chemical too quickly. Think of trying to listen to an FM radio station in the hills of Nepal. The station is broadcasting, but the signal is faint and there is static. The problem is not that you don't want to listen. The problem is signal-to-noise.

Findings about the transporters are mixed across studies, and scientists keep refining the details. But there is a way to actually see this signaling in living people. And that is one of the great achievements of modern neuroscience.

CHAPTER 7: HOW WE SAW THE INVISIBLE (25:00 to 28:30)
*** VISUAL: A PET scanner, a doughnut-shaped machine, with a patient sliding in. ***

For a long time, ADHD was judged only by behavior. Then came brain imaging.

The key tool for seeing neurotransmitter systems is called *** PET ***, Positron Emission Tomography.

*** VISUAL: Step-by-step animation. ***

Here is how it works.

Step one. Scientists create a molecule that fits a specific target, for example a dopamine receptor or transporter, the way a key fits one lock. They attach a *** radiotracer ***, a short-lived radioactive atom such as carbon-11, to that molecule.

Step two. A tiny amount is injected into the person's bloodstream. It travels to the brain and binds to its targets.

Step three. As the radioactive atom decays, it emits a *** positron ***. The positron meets an electron, and the two annihilate each other, producing two gamma rays that fly off in exactly opposite directions.

Step four. A ring of detectors around the head catches these pairs. A computer traces them back and builds a three-dimensional map of where the target molecules are, and how many.

*** VISUAL: A colorful PET image of a brain, with hot spots (red and yellow) marking dopamine transporter or receptor density. ***

Different tracers reveal different things. *** Raclopride *** labeled with carbon-11 binds to *** D2/D3 dopamine receptors *** and competes with the brain's own dopamine, so it can even reveal how much dopamine is being released. Other tracers bind to the *** dopamine transporter ***, and there are tracers for the *** norepinephrine transporter ***.

*** VISUAL: Portrait style graphics of Alan Zametkin (1990) and Nora Volkow (2009, 2011). ***

The story of ADHD imaging has a few landmarks.

In 1990, Alan Zametkin and colleagues at the NIMH, using PET, reported in the New England Journal of Medicine that adults with a history of hyperactivity since childhood showed lower glucose metabolism, meaning lower brain activity, in prefrontal and premotor areas. It was one of the first images that told the world: this is a brain difference.

Then, in 2009 and 2011, *** Nora Volkow *** and colleagues used PET to study unmedicated adults with ADHD. They found reduced availability of dopamine receptors and transporters in the brain's reward pathway, specifically the nucleus accumbens and midbrain. And, crucially, the lower these measures were, the more the person reported problems with attention and motivation. The biology tracked the lived experience.

*** VISUAL: Scatter plot showing lower dopamine markers correlating with higher inattention scores. ***

We also have *** fMRI ***, functional Magnetic Resonance Imaging. It does not see neurotransmitters. It tracks changes in blood oxygen, which rise where neurons are working harder. That is how we saw the DMN and TPN behaving differently.

Together, PET, MRI and fMRI let us peek into living brains for the first time in human history. And what they show, again and again, is that ADHD leaves biological fingerprints.

CHAPTER 8: HOW ADHD MEDICATIONS WORK (28:30 to 33:00)
*** VISUAL: A calm text card: "Educational information only. Medication decisions belong to you and a qualified doctor." ***

Now, medications. This is a topic surrounded by fear, so let's look at what actually happens, molecule by molecule.

The Baseline
*** VISUAL: Synapse animation. Dopamine and norepinephrine released in small puffs, quickly vacuumed away by transporters. Few receptors activated. ***

In a synapse with weak signaling, neurotransmitters are released, but they are taken back up quickly, so they do not stay long enough or in high enough concentration to strongly activate the next neuron. Weak signal. Static.

Stimulants: Methylphenidate
*** VISUAL: Methylphenidate molecule approaching the *** Dopamine Transporter *** and *** Norepinephrine Transporter ***, plugging them like a cork. ***

*** Methylphenidate *** is the most widely used stimulant for ADHD. It binds to the dopamine transporter and the norepinephrine transporter, and blocks them. The vacuum cleaners get jammed. Dopamine and norepinephrine now stay in the synapse longer.

*** VISUAL: The synapse again, but now the neurotransmitters linger and light up many more receptors. ***

More chemical stays. More receptors are activated. The signal strengthens.

PET studies by Volkow and colleagues showed that at clinical oral doses, methylphenidate occupies a large portion of dopamine transporters, roughly half or more. And the increase in dopamine happens slowly and gradually with a proper oral dose, very different from the sharp spike produced by illegal drugs taken quickly. That difference in speed is a key reason why doctor-prescribed medication is not the same thing as "getting high."

Stimulants: Amphetamines
*** VISUAL: Amphetamine molecule entering the neuron through the dopamine transporter, reaching vesicles, causing them to release dopamine into the cell interior, and the transporter running in reverse. ***

*** Amphetamines *** work in a related but slightly different way. They are so similar to dopamine and norepinephrine that they are carried into the neuron by the transporters. Inside, they help push neurotransmitters out of storage vesicles, and they can make the transporter run in reverse, pumping dopamine and norepinephrine out into the synapse. They also block reuptake. Result: more release, and less cleanup. Same destination, a different route.

Non-Stimulant: Atomoxetine
*** VISUAL: Atomoxetine molecule selectively plugging only the Norepinephrine Transporter. ***

*** Atomoxetine *** is a non-stimulant. It selectively blocks the norepinephrine transporter. That raises norepinephrine everywhere. But here is the clever part. In the prefrontal cortex, dopamine transporters are relatively scarce, and the norepinephrine transporter also helps clear dopamine. So blocking it raises both norepinephrine and dopamine in the PFC, while barely changing dopamine in the reward centers like the nucleus accumbens. That is why atomoxetine has very low potential for misuse.

*** VISUAL: Split brain diagram. PFC: NE and DA both increase. Nucleus accumbens: little change. ***

It works more slowly than a stimulant: it usually takes several weeks to reach full effect, as the brain adapts.

Other non-stimulants, such as *** guanfacine *** and *** clonidine ***, act on *** alpha-2A receptors *** in the prefrontal cortex, helping strengthen the connections between prefrontal neurons. In fact, a recent Nepali hospital study of children with ADHD found clonidine and atomoxetine to be the most commonly used medicines, which tells us something about what is practically available here. We will come back to that.

The Result
*** VISUAL: The FM radio analogy: static fading, clear station coming in. Then the brain networks: TPN brighter, DMN quieter. ***

The net effect: a clearer signal. In the prefrontal cortex, stronger, cleaner communication. In the reward pathways, better balance. Imaging studies show that medication can strengthen task-network activity and improve the suppression of the default mode network. In plain words, the radio is finally tuned in.

Large reviews of clinical trials have found that stimulants are among the most effective treatments in all of psychiatry, particularly for children.

But let me say three things clearly.

One. Medication is not a personality change, and it is not supposed to make anyone a "zombie." A well-adjusted dose helps a person be more themselves, not less. If it does the opposite, that is a reason to go back to the doctor and adjust the dose or the drug, not a reason to give up.

Two. Medication does not build skills. Therapy, parent training, school support, coaching, sleep, exercise and structure are essential parts of care.

Three. These are prescription medicines with real side effects, such as reduced appetite, trouble sleeping, and changes in heart rate and blood pressure. They need a proper evaluation and follow-up with a qualified doctor. Never take or give them without one.

CHAPTER 9: A HISTORY OF BEING MISUNDERSTOOD (33:00 to 36:00)
*** VISUAL: Animated timeline running left to right across the screen. ***

*** VISUAL: 1798. Sir Alexander Crichton, a Scottish physician. Cover of his book "An Inquiry into the Nature and Origin of Mental Derangement." ***

A Scottish physician, *** Sir Alexander Crichton ***, wrote about a condition he called "mental restlessness." He described people who could not attend to anything with constancy, and noted that it could appear from early childhood. This was before electricity, before the telephone, before anyone blamed screens.
*** VISUAL: 1845. Illustration of "Fidgety Phil" and "Johnny Head-in-Air" from Struwwelpeter by Heinrich Hoffmann. ***

A German doctor named Heinrich Hoffmann wrote a children's book with characters that look strikingly familiar: "Fidgety Phil," who cannot sit at the dinner table, and "Johnny Head-in-Air," who never looks where he is walking.
*** VISUAL: 1902. Sir George Still delivering the Goulstonian Lectures, Royal College of Physicians, London. ***

*** Sir George Still ***, in lectures at the Royal College of Physicians in London, described a group of children with serious problems in sustained attention and self-control. Importantly, he observed that this occurred in children who had been raised in good homes, and he suspected a biological and possibly inherited cause, not bad upbringing. That was over 120 years ago.
*** VISUAL: 1917 to 1918 and 1937 timeline markers. ***

After the 1917 to 1918 encephalitis epidemic, doctors saw children with brain inflammation who developed hyperactivity and impulsivity, and this strengthened the idea of a brain-based cause. In 1937, Dr. Charles Bradley accidentally discovered that a stimulant drug, Benzedrine, calmed and focused some hyperactive children in a US residential home. Methylphenidate was synthesized in the 1940s and introduced in the 1950s.

*** VISUAL: DSM covers. DSM-II 1968 "Hyperkinetic Reaction of Childhood." DSM-III 1980 "Attention Deficit Disorder." DSM-III-R 1987 "ADHD." DSM-IV 1994. DSM-5 2013. ***

The formal labels then evolved. In 1968, the American diagnostic manual called it "hyperkinetic reaction of childhood." In 1980 it became "Attention Deficit Disorder." In 1987 the name "ADHD" appeared. In 2013, the DSM-5 formally classified it as a *** neurodevelopmental disorder ***, alongside conditions like autism, and recognized that it continues into adulthood. The World Health Organization's ICD-11 does the same.

*** VISUAL: Icons for 1990 PET study, 2007 cortical maturation, 2017 ENIGMA, 2019 and 2023 genetics. ***

Then came the modern validation. The 1990 PET study. The 2007 delayed-maturation study. The 2017 ENIGMA study. And genetics: twin studies estimate that ADHD is about *** 70 to 80 percent heritable ***, comparable to human height. In 2019 and again in 2023, huge genome-wide studies identified more than two dozen specific regions of DNA that are associated with ADHD, in genes active in the developing brain.

*** VISUAL: Two silhouettes. One tall person, one short person. Caption: "Height: about 80% heritable. ADHD: about 74%." ***

Nobody tells a short person to "just try harder to be tall." Nobody tells a nearsighted child to "concentrate and read the board." Yet, when the difference lives inside the brain, we call it a character flaw.

And it is not a modern invention or a Western one. A major worldwide analysis of ADHD prevalence found that most differences between countries came from how studies were done, not from where. In every culture where researchers look carefully, they find it.

CHAPTER 10: ADHD IN NEPAL (36:00 to 40:00)
*** VISUAL: Kathmandu street life, school gates at morning, a crowded tuition class, a family sitting together at home. ***

So what does this mean for us, here?

In Nepal, ADHD is very often called something else. *** Aalasi. Jiddi. Bigreko. Padhai ma man nalagne. *** "Discipline chaina." "Ali dhyan deu na." "It's the phone." "It's how the mother raised him."

*** VISUAL: Each phrase appears on screen and dissolves. ***

Let's answer each one with evidence.

"It's laziness." Lazy people do not choose to fail. Brain scans, genetics and neurochemistry show real differences in effort-regulation systems.

"It's bad parenting." Parenting does not cause ADHD. Sir George Still noticed that back in 1902. What parents do can make life easier or harder for a child with ADHD, and supportive, structured, patient parenting makes a huge difference in outcomes. But the origin is neurodevelopmental.

"It's phones and screens." ADHD was described in 1798. Screens can worsen distraction for everyone, but they did not create ADHD.

"It's only in Western countries." Research in Nepal itself says otherwise. Doctors at the Child and Adolescent Psychiatry unit of *** Kanti Children's Hospital *** in Kathmandu reviewed records over two and a half years, from 2021 to mid-2023, and found 585 children diagnosed with ADHD. The authors concluded that ADHD is highly prevalent in Nepal. They also found that many children had additional conditions, such as autism spectrum disorder in about 17 percent, and intellectual disability in about 16 percent, so careful, complete assessment matters. And they described management as extremely challenging, given the limited treatment options here.

*** VISUAL: Graphic of the Kanti Children's Hospital study numbers: 585 children, about 86% boys, top medicines: clonidine, atomoxetine. ***

Notice one more number. About 86 percent of those children were boys. Globally, boys are diagnosed more often, but that gap is also partly because girls with ADHD tend to show quieter, inattentive symptoms, such as daydreaming, forgetfulness and anxiety, and are often missed, or dismissed as "dreamy" or "careless." Many Nepali girls and women may be growing up and living with undiagnosed ADHD.

*** VISUAL: A young woman at a desk, with sticky notes everywhere, looking overwhelmed. Text: "Missed. Misjudged. Misunderstood." ***

There is also a practical challenge. For years, Nepali clinicians noted that there was no ADHD assessment tool designed for Nepali language and culture, and researchers in Kathmandu have been working to build and validate one. So the system is still growing. Specialists are few, and services are concentrated in the cities. That means many families in the hills and Terai may struggle even to find someone who can evaluate them.

So what can you do?

If any of this sounds familiar, for you or your child, remember these points about how diagnosis works. Symptoms must be persistent, must have started before age 12, must appear in more than one setting, such as home and school or work, and must cause real problems. Many other conditions, such as anxiety, depression, thyroid problems, sleep problems, learning difficulties and trauma, can look like ADHD. That is why the right person to ask is a qualified psychiatrist or child psychiatrist, or a clinical psychologist, not a neighbor, not a YouTube video, and not me.

For parents: praise effort rather than result, break tasks into small steps, use routines, allow movement, talk with teachers, and above all, protect your child's self-esteem. A child with ADHD hears "no," "stop," and "hurry up" perhaps twenty thousand times before age ten. What that child needs most from you is to hear that they are not the problem.

For adults: it is not too late. Many adults in Nepal have lived thirty or forty years believing they are "just lazy," when what they had was undiagnosed ADHD.

CHAPTER 11: A DIFFERENT OPERATING SYSTEM (40:00 to 42:00)
*** VISUAL: Return to the opening "March of Progress" image. This time, the line dissolves and turns into a branching tree, with many human silhouettes of different shapes, each glowing differently. ***

Let's return to the picture where we began.

A single line, from ape to human, with one final, "finished" version at the end. We now know that picture was never true, not for evolution and not for human minds.

*** VISUAL: Two smartphones side by side. One running Android, one running iOS. ***

Think of two phones. One runs Android. One runs iOS. Neither is broken. They are different operating systems. But if you try to install an app built for one into the other, it crashes, and you might conclude the phone is faulty.

The ADHD brain is not a broken version of a "normal" brain. It is a different operating system, one that developed inside a species that survived for hundreds of thousands of years by being diverse. It runs on interest, urgency and novelty. It scans wide. It moves fast. And it is being asked to run inside a world of desks, deadlines and fixed schedules that appeared in the last blink of evolutionary time.

Does that mean ADHD is only a superpower? No, and I would be lying if I said that. ADHD can carry real costs: school failure, injuries, relationship strain, anxiety, and depression, especially when it goes unrecognized. That is exactly why it counts as a disorder, and why treatment is worthwhile.

But it does mean this. The person in front of you who cannot sit still, who forgets the homework, who talks too fast, who feels everything too loudly, is not lazy, and not spoiled, and not a failure of upbringing. They are a human being with a brain wired a little differently, doing their best in a world that was not designed for them.

*** VISUAL: Montage of Nepali people in high-energy, fast-response, creative roles: a chef in a busy kitchen, a rescue worker, a trekking guide, a musician, a founder, a teacher. ***

When we understand that, we stop asking "What is wrong with you?" and start asking "What does your brain need, and how can we build a world in which it can thrive?"

Nepal has always known how to make room for many kinds of people, many languages, many ways of living. Let us make room for many kinds of minds, too.

If this video helped you, share it with the parent, teacher or friend who needs to hear it. Talk about it at the dining table. And if you recognized yourself or your child in this story, take the brave next step: speak to a qualified professional.

Because being different is not a defect. Being misunderstood, for a lifetime, is the real injury.

Thank you for watching.

*** VISUAL: End screen with subscribe button, next-video suggestion, and the on-screen disclaimer below. ***

On-screen disclaimer: This video is for education only and is not medical advice or a diagnosis. Many conditions can resemble ADHD. Please consult a qualified psychiatrist or clinical psychologist for evaluation and treatment.

PRODUCTION NOTES
Fact-check flags to keep the script honest:

The Hunter versus Farmer idea is presented as a hypothesis. Keep that wording on screen.

The DRD4-7R allele has a small effect on ADHD risk. Do not show it as "the ADHD gene."

Brain imaging findings are group-level. Do not imply a scan can diagnose an individual.

Hyperfocus is commonly reported but is not a formal diagnostic criterion.

Do not name specific doses, and do not imply anyone should start or stop medication on their own.

KEY SOURCES FOR THE VIDEO DESCRIPTION
Evolution and genetics

Hartmann, T. (1993). Attention Deficit Disorder: A Different Perception.
Chen, C. et al. (1999). Population migration and the variation of dopamine D4 receptor allele frequencies around the globe. Evolution and Human Behavior.
Ding, Y.C. et al. (2002). Evidence of positive selection acting at the human dopamine receptor D4 gene locus. PNAS.
Eisenberg, D.T.A. et al. (2008). Dopamine receptor genetic polymorphisms and body composition in undernourished pastoralists (Ariaal). BMC Evolutionary Biology.
Barack, D.L. et al. (2024). Attention deficits linked with proclivity to explore while foraging. Proceedings of the Royal Society B.
Faraone, S.V. and Larsson, H. (2019). Genetics of ADHD. Molecular Psychiatry.
Demontis, D. et al. (2019; 2023). Genome-wide association studies of ADHD. Nature Genetics.
Brain structure and networks

Shaw, P. et al. (2007). Attention-deficit/hyperactivity disorder is characterized by a delay in cortical maturation. PNAS.
Hoogman, M. et al. (2017). Subcortical brain volume differences in ADHD (ENIGMA). Lancet Psychiatry.
Sonuga-Barke, E. and Castellanos, F.X. (2007). Spontaneous attentional fluctuations in impaired states and pathological conditions. Neuroscience and Biobehavioral Reviews.
Cortese, S. et al. (2012). Toward systems neuroscience of ADHD: a meta-analysis of 55 fMRI studies. American Journal of Psychiatry.
Neurochemistry and imaging

Zametkin, A.J. et al. (1990). Cerebral glucose metabolism in adults with hyperactivity of childhood onset. New England Journal of Medicine.
Volkow, N.D. et al. (2009). Evaluating dopamine reward pathway in ADHD. JAMA.
Volkow, N.D. et al. (2011). Motivation deficit in ADHD is associated with dysfunction of the dopamine reward pathway. Molecular Psychiatry.
Volkow, N.D. et al. (1998). Dopamine transporter occupancies in the human brain induced by therapeutic doses of oral methylphenidate. American Journal of Psychiatry.
Arnsten, A.F.T. (various). Catecholamine influences on prefrontal cortical function (inverted-U model).
Bymaster, F.P. et al. (2002). Atomoxetine increases extracellular levels of norepinephrine and dopamine in prefrontal cortex. Neuropsychopharmacology.
History and prevalence

Crichton, A. (1798). An Inquiry into the Nature and Origin of Mental Derangement.
Still, G.F. (1902). Some abnormal psychical conditions in children (Goulstonian Lectures). The Lancet.
Polanczyk, G. et al. (2007). The worldwide prevalence of ADHD: a systematic review and metaregression analysis. American Journal of Psychiatry.
American Psychiatric Association. DSM-5 and DSM-5-TR (2013; 2022). WHO ICD-11.
Nepal

Clinico-demographic profile of children and adolescents with ADHD presenting to a tertiary care centre (Kanti Children's Hospital). Journal of the Nepal Medical Association (2024).
Rimal, H.S. and Pokharel, A. (2016). Prevalence of ADHD among school children and associated co-morbidities: a hospital-based descriptive study (Biratnagar). Kathmandu University Medical Journal.
Nepal ADHD scale development and validation study (2018), Nepal Health Research Council.
