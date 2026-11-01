"use client";

import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { ReactLenis } from "lenis/react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  Code2,
  Database,
  FolderKanban,
  KeyRound,
  Link2,
  MousePointer2,
  Sparkles,
  Table2,
  Terminal,
  Zap,
} from "lucide-react";
import { MotionConfig, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import StickerIcon from "@/components/StickerIcon";
import NeoBrutalCursor from "@/components/NeoBrutalCursor";

const lenisOptions = {
  autoRaf: true,
  anchors: true,
  lerp: 0.085,
  smoothWheel: true,
  syncTouch: false,
  respectReducedMotion: true,
};

const workflow = [
  {
    number: "01",
    title: "Start with a project",
    body: "Give the idea a name. DBFY keeps each schema in your own project workspace.",
    icon: FolderKanban,
    color: "bg-violet",
  },
  {
    number: "02",
    title: "Build the shape",
    body: "Add tables and fields, then mark primary keys, nullability, uniqueness, and generated values.",
    icon: Table2,
    color: "bg-acid",
  },
  {
    number: "03",
    title: "Connect the dots",
    body: "Link fields on the canvas to define references between tables, then switch to SQL or Prisma.",
    icon: Link2,
    color: "bg-sky",
  },
];

const features = [
  {
    icon: Table2,
    color: "bg-acid",
    label: "01 / Shape it",
    title: "Tables you can actually see.",
    copy: "Build a schema on a visual canvas. Each table keeps its fields, types, and constraints together.",
  },
  {
    icon: Link2,
    color: "bg-violet",
    label: "02 / Connect it",
    title: "Relationships, out in the open.",
    copy: "Connect field handles to define references. No more decoding mystery IDs from memory.",
  },
  {
    icon: Braces,
    color: "bg-coral",
    label: "03 / Take it with you",
    title: "SQL or Prisma. Your call.",
    copy: "Flip the schema view, inspect the generated code, and copy the format you need.",
  },
];

function StartLink({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <>
      <Show when="signed-in">
        <Link href="/playground" className={className}>{children}</Link>
      </Show>
      <Show when="signed-out">
        <Link href="/sign-up" className={className}>{children}</Link>
      </Show>
    </>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function TablePreview({ name, fields, accent }: { name: string; fields: string[]; accent: string }) {
  return (
    <div className="w-full max-w-[220px] border-[3px] border-ink bg-paper shadow-[5px_5px_0_var(--palette-ink)]">
      <div className={`flex items-center justify-between border-b-[3px] border-ink px-3 py-2 ${accent}`}>
        <span className="font-mono text-[11px] font-black uppercase tracking-wide">{name}</span>
        <Table2 size={14} strokeWidth={3} aria-hidden="true" />
      </div>
      <div className="divide-y-2 divide-dashed divide-ink/20">
        {fields.map((field, index) => (
          <div key={field} className="flex items-center justify-between gap-2 px-3 py-2">
            <span className="flex items-center gap-2 font-mono text-[10px] font-bold">
              {index === 0 ? <KeyRound size={12} strokeWidth={3} className="text-brand" /> : <span className="size-3" />}
              {field}
            </span>
            <span className="text-[9px] font-black uppercase text-neutral-500">{index === 0 ? "UUID" : "TEXT"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CanvasPreview() {
  return (
    <div className="relative min-h-[390px] overflow-hidden border-[3px] border-ink bg-canvas shadow-[8px_8px_0_var(--palette-ink)] sm:min-h-[460px]">
      <div className="flex h-11 items-center justify-between border-b-[3px] border-ink bg-paper px-3">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center border-2 border-ink bg-acid"><Database size={13} strokeWidth={3} /></span>
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.12em]">tiny shop / schema</span>
        </div>
        <span className="border-2 border-ink bg-violet px-2 py-1 font-mono text-[9px] font-black">CANVAS 01</span>
      </div>
      <div className="relative flex h-[calc(100%-44px)] min-h-[346px] items-center justify-center p-5 sm:min-h-[416px]">
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "radial-gradient(var(--palette-grid) 1px, transparent 1px)", backgroundSize: "17px 17px" }} />
        <div className="relative z-10 grid w-full max-w-[430px] grid-cols-2 items-center gap-4 sm:gap-7">
          <TablePreview name="users" fields={["id", "email", "handle"]} accent="bg-acid" />
          <TablePreview name="posts" fields={["id", "authorId", "title"]} accent="bg-violet" />
          <div className="absolute left-1/2 top-[47%] z-20 -translate-x-1/2 -translate-y-1/2 border-2 border-ink bg-sky px-2 py-1 font-mono text-[9px] font-black shadow-[2px_2px_0_var(--palette-ink)] sm:px-3 sm:text-[10px]">
            users.id → posts.authorId
          </div>
        </div>
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 border-2 border-ink bg-paper px-2.5 py-1.5 shadow-[3px_3px_0_var(--palette-ink)]">
          <span className="size-2 border border-ink bg-acid" />
          <span className="font-mono text-[9px] font-black uppercase tracking-wider">2 tables · 1 relation</span>
        </div>
        <StickerIcon icon={MousePointer2} label="Canvas cursor" color="pink" rotation={-8} size={48} iconSize={22} className="absolute right-[42%] top-[58%] z-30 rounded-xl" float />
      </div>
    </div>
  );
}

function CodePreview() {
  return (
    <div className="overflow-hidden border-[3px] border-ink bg-[#f7f4ed] shadow-[6px_6px_0_var(--palette-ink)]">
      <div className="flex items-center justify-between border-b-2 border-ink bg-paper px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Terminal size={15} strokeWidth={3} />
          <span className="font-mono text-[10px] font-black">schema.sql</span>
        </div>
        <span className="border border-ink bg-acid px-1.5 py-0.5 font-mono text-[8px] font-black">READY TO COPY</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[10px] leading-5 sm:text-[11px]"><code>
        <span className="text-[#7156ff]">CREATE TABLE</span> <span className="text-[#087a61]">&quot;users&quot;</span> (<br />
        &nbsp;&nbsp;<span className="text-[#b33c72]">&quot;id&quot;</span> <span className="text-[#7156ff]">UUID PRIMARY KEY NOT NULL</span>,<br />
        &nbsp;&nbsp;<span className="text-[#b33c72]">&quot;email&quot;</span> TEXT <span className="text-[#7156ff]">UNIQUE NOT NULL</span><br />
        );<br /><br />
        <span className="text-[#7156ff]">CREATE TABLE</span> <span className="text-[#087a61]">&quot;posts&quot;</span> (<br />
        &nbsp;&nbsp;<span className="text-[#b33c72]">&quot;id&quot;</span> UUID PRIMARY KEY NOT NULL,<br />
        &nbsp;&nbsp;<span className="text-[#b33c72]">&quot;authorId&quot;</span> UUID NOT NULL,<br />
        &nbsp;&nbsp;<span className="text-[#b33c72]">&quot;title&quot;</span> TEXT NOT NULL,<br />
        &nbsp;&nbsp;<span className="text-[#7156ff]">FOREIGN KEY</span> (&quot;authorId&quot;) <span className="text-[#7156ff]">REFERENCES</span> &quot;users&quot; (&quot;id&quot;)<br />
        );<br />
        <span className="text-[#777166]">-- generated from the canvas</span>
      </code></pre>
    </div>
  );
}

export default function LandingExperience() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroProgress = useScroll({ target: heroRef, offset: ["start start", "end start"] }).scrollYProgress;
  const visualY = useTransform(heroProgress, [0, 1], [0, 76]);
  const stickerRotation = useTransform(scrollYProgress, [0, 1], [-5, 12]);

  return (
    <ReactLenis root options={lenisOptions}>
      <MotionConfig reducedMotion="user">
        <main id="top" className="landing-experience relative overflow-x-clip bg-canvas text-ink selection:bg-acid selection:text-ink">
          <NeoBrutalCursor />
          {!reduceMotion && <motion.div aria-hidden="true" className="fixed left-0 right-0 top-0 z-[70] h-1 origin-left bg-brand" style={{ scaleX: scrollYProgress }} />}

          <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-canvas/95 backdrop-blur-md">
            <nav aria-label="Main navigation" className="mx-auto flex h-[70px] max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-12">
              <Link href="/" className="flex items-center gap-2.5" aria-label="DBFY home">
                <span className="grid size-9 place-items-center border-[3px] border-ink bg-acid shadow-[3px_3px_0_var(--palette-ink)]"><Database size={18} strokeWidth={3} /></span>
                <span className="text-xl font-black tracking-[-0.08em]">DBFY<span className="text-brand">.</span></span>
              </Link>
              <div className="hidden items-center gap-8 text-xs font-black uppercase tracking-wider md:flex">
                <a href="#workflow" className="decoration-2 underline-offset-4 hover:underline">How it works</a>
                <a href="#features" className="decoration-2 underline-offset-4 hover:underline">The good stuff</a>
                <a href="#end" className="decoration-2 underline-offset-4 hover:underline">Get started</a>
              </div>
              <div className="flex items-center gap-3">
                <Show when="signed-out">
                  <Link href="/sign-in" className="hidden px-2 py-2 text-[11px] font-black uppercase tracking-wide underline decoration-2 underline-offset-4 hover:text-brand sm:inline-flex">Sign in</Link>
                  <Link href="/sign-up" className="inline-flex items-center gap-2 border-[2px] border-ink bg-pink px-3 py-2 text-[11px] font-black shadow-[3px_3px_0_var(--palette-ink)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_var(--palette-ink)] sm:px-4 sm:text-xs">
                    Sign up <ArrowUpRight size={15} strokeWidth={3} />
                  </Link>
                </Show>
                <Show when="signed-in">
                  <StartLink className="inline-flex items-center gap-2 border-[2px] border-ink bg-pink px-3 py-2 text-[11px] font-black shadow-[3px_3px_0_var(--palette-ink)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_var(--palette-ink)] sm:px-4 sm:text-xs">
                    <span className="hidden sm:inline">Open the playground</span><span className="sm:hidden">Let’s build</span><ArrowUpRight size={15} strokeWidth={3} />
                  </StartLink>
                </Show>
              </div>
            </nav>
          </header>

          <section ref={heroRef} className="relative mx-auto grid min-h-[calc(100svh-70px)] max-w-[1440px] items-center gap-12 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-12 lg:py-20">
            <div className="relative z-10">
              <Reveal>
                <div className="mb-6 inline-flex items-center gap-2 border-2 border-ink bg-violet px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] shadow-[3px_3px_0_var(--palette-ink)] sm:text-xs">
                  <Sparkles size={14} strokeWidth={3} /> A visual database schema builder
                </div>
                <h1 className="max-w-[740px] text-[clamp(3.45rem,8vw,7.7rem)] font-black leading-[0.82] tracking-[-0.09em]">
                  Your schema.<br />
                  <span className="relative inline-block bg-acid px-2 pb-2">Out of your</span><br />
                  <span className="font-serif italic font-semibold tracking-[-0.075em]">head.</span>
                </h1>
                <p className="mt-7 max-w-xl text-base font-semibold leading-7 text-neutral-700 sm:text-lg sm:leading-8">
                  Map tables and fields on a canvas. Connect the relationships. Copy out SQL or Prisma. The schema finally makes sense at a glance.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <StartLink className="group inline-flex items-center gap-3 border-[3px] border-ink bg-acid px-5 py-3.5 text-sm font-black shadow-[5px_5px_0_var(--palette-ink)] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_var(--palette-ink)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-brand">
                    Build your first schema <ArrowRight size={17} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
                  </StartLink>
                  <a href="#workflow" className="inline-flex items-center gap-2 px-2 py-3 text-xs font-black uppercase tracking-wide underline decoration-2 underline-offset-4 hover:text-brand">
                    Take the 20-second tour <ArrowDownRight size={15} strokeWidth={3} />
                  </a>
                </div>
                <div className="mt-8 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider">
                  <span className="border-2 border-ink bg-paper px-2.5 py-1.5">SQL</span>
                  <span className="border-2 border-ink bg-paper px-2.5 py-1.5">Prisma</span>
                  <span className="border-2 border-ink bg-paper px-2.5 py-1.5">Foreign keys</span>
                  <span className="border-2 border-ink bg-paper px-2.5 py-1.5">Saved projects</span>
                </div>
              </Reveal>
              <motion.div style={{ rotate: stickerRotation }} className="absolute -right-2 top-0 hidden lg:block">
                <StickerIcon icon={Zap} label="Fast schema flow" color="coral" rotation={4} size={72} float />
              </motion.div>
            </div>

            <motion.div style={{ y: reduceMotion ? 0 : visualY }} className="relative mx-auto w-full max-w-[680px] lg:ml-auto">
              <div aria-hidden="true" className="absolute -inset-5 -rotate-2 border-[3px] border-ink bg-sky/70" />
              <div className="relative">
                <CanvasPreview />
                <div className="absolute -left-3 -top-5 hidden sm:block lg:-left-8">
                  <StickerIcon icon={KeyRound} label="Primary key" color="lemon" rotation={-7} size={64} float />
                </div>
                <div className="absolute -bottom-11 right-4 z-20 w-[min(78%,360px)] sm:-right-4">
                  <CodePreview />
                </div>
                <div className="absolute -right-2 top-[42%] z-20 hidden sm:block lg:-right-8">
                  <StickerIcon icon={Braces} label="SQL and Prisma output" color="pink" rotation={7} size={61} float />
                </div>
              </div>
              <p className="mt-16 text-right font-mono text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500">From canvas to copy-ready code. No lore required.</p>
            </motion.div>
          </section>

          <section className="relative overflow-hidden border-y-[3px] border-ink bg-ink py-12 text-paper sm:py-16">
            <div aria-hidden="true" className="absolute -right-5 -top-8 size-40 rotate-12 border-[3px] border-paper/15" />
            <div className="mx-auto grid max-w-[1440px] gap-8 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16 lg:px-12">
              <Reveal>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-acid">The schema spiral</p>
                <h2 className="mt-4 max-w-xl text-4xl font-black leading-[0.92] tracking-[-0.07em] sm:text-6xl">Wait. Which field was the foreign key again?</h2>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["notes.md", "users.id → ???", "bg-coral"],
                    ["random-tab.sql", "did I save this?", "bg-violet"],
                    ["your brain", "loading...", "bg-acid"],
                  ].map(([file, note, color], index) => (
                    <motion.div key={file} whileHover={reduceMotion ? undefined : { y: -5, rotate: index % 2 ? 1 : -1 }} className={`${color} min-h-28 border-[3px] border-paper p-3 text-ink shadow-[4px_4px_0_var(--palette-purple)]`}>
                      <p className="font-mono text-[9px] font-black uppercase tracking-widest">{file}</p>
                      <p className="mt-5 font-black tracking-tight">{note}</p>
                    </motion.div>
                  ))}
                </div>
                <p className="mt-5 max-w-2xl text-sm font-medium leading-6 text-paper/75">A schema is already complicated. Keeping it across notes, tabs, and half-remembered decisions is extra chaos.</p>
              </Reveal>
            </div>
          </section>

          <section id="workflow" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 py-20 sm:px-8 sm:py-28 lg:px-12">
            <div className="mb-12 max-w-3xl">
              <Reveal>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-brand">A tiny workflow glow-up</p>
                <h2 className="mt-4 text-4xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl">From “I think this connects?”<br className="hidden sm:block" /> to <span className="bg-pink px-1">actually, yes.</span></h2>
              </Reveal>
            </div>
            <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
              <div className="space-y-5">
                {workflow.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <Reveal key={step.number} delay={index * 0.06}>
                      <article className="grid grid-cols-[54px_1fr] gap-4 border-t-[3px] border-ink py-5">
                        <div className={`grid size-12 place-items-center border-[3px] border-ink ${step.color} shadow-[3px_3px_0_var(--palette-ink)]`}><Icon size={21} strokeWidth={3} /></div>
                        <div>
                          <p className="font-mono text-[9px] font-black tracking-[0.18em] text-neutral-500">STEP {step.number}</p>
                          <h3 className="mt-1 text-xl font-black tracking-[-0.04em]">{step.title}</h3>
                          <p className="mt-2 max-w-md text-sm font-medium leading-6 text-neutral-600">{step.body}</p>
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
                <Reveal delay={0.2}>
                  <div className="flex items-center gap-2 pt-2 font-mono text-[10px] font-black uppercase tracking-widest text-brand"><Check size={15} strokeWidth={4} /> Save it to your project when it’s ready.</div>
                </Reveal>
              </div>
              <div className="relative lg:pt-4">
                <div className="sticky top-24">
                  <div className="absolute -right-2 -top-4 z-20 sm:right-4">
                    <StickerIcon icon={Sparkles} label="Schema in progress" color="lemon" rotation={8} size={58} float />
                  </div>
                  <CanvasPreview />
                  <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <p className="max-w-md text-xs font-semibold leading-5 text-neutral-600">The canvas is the source of truth: table names, field constraints, and connected references feed the generated schema.</p>
                    <div className="flex w-fit border-2 border-ink bg-paper p-1 shadow-[3px_3px_0_var(--palette-ink)]">
                      <span className="border-2 border-ink bg-acid px-3 py-1.5 font-mono text-[10px] font-black">SQL</span>
                      <span className="px-3 py-1.5 font-mono text-[10px] font-black text-neutral-500">PRISMA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="scroll-mt-24 border-y-[3px] border-ink bg-lemon py-20 sm:py-24">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                <Reveal>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]">Less “where did I put that?”</p>
                  <h2 className="mt-3 max-w-2xl text-4xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl">All the schema stuff.<br />In one little universe.</h2>
                </Reveal>
                <StickerIcon icon={Database} label="Database" color="sky" rotation={5} size={70} float className="hidden sm:grid" />
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Reveal key={feature.label} delay={index * 0.07}>
                      <motion.article whileHover={reduceMotion ? undefined : { y: -6 }} className="h-full border-[3px] border-ink bg-paper p-5 shadow-[5px_5px_0_var(--palette-ink)] sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <StickerIcon icon={Icon} label={feature.label} color={feature.color.replace("bg-", "") as "acid" | "violet" | "coral"} rotation={index % 2 === 0 ? -3 : 4} size={55} />
                          <span className="pt-1 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-neutral-500">{feature.label}</span>
                        </div>
                        <h3 className="mt-7 text-2xl font-black leading-tight tracking-[-0.055em]">{feature.title}</h3>
                        <p className="mt-3 text-sm font-medium leading-6 text-neutral-600">{feature.copy}</p>
                      </motion.article>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mx-auto grid max-w-[1440px] gap-12 px-4 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16 lg:px-12">
            <Reveal>
              <div className="relative">
                <StickerIcon icon={Code2} label="Code output" color="sky" rotation={-6} size={70} float className="absolute -right-4 -top-9 z-10" />
                <CodePreview />
                <div className="mt-4 inline-flex items-center gap-2 border-2 border-ink bg-acid px-3 py-2 font-mono text-[10px] font-black uppercase tracking-wider shadow-[3px_3px_0_var(--palette-ink)]"><Check size={14} strokeWidth={4} /> Copy-ready output</div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-brand">No more screenshot-to-SQL pipeline</p>
              <h2 className="mt-4 text-4xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl">The diagram is nice.<br />The code is the point.</h2>
              <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-neutral-700">Switch between SQL and Prisma right beside your canvas. Check the output, hit copy, and keep building wherever your project lives.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="border-2 border-ink bg-violet px-3 py-2 font-mono text-[10px] font-black">Primary keys</span>
                <span className="border-2 border-ink bg-coral px-3 py-2 font-mono text-[10px] font-black">Constraints</span>
                <span className="border-2 border-ink bg-sky px-3 py-2 font-mono text-[10px] font-black">Field references</span>
              </div>
            </Reveal>
          </section>

          <section id="end" className="scroll-mt-24 relative overflow-hidden border-y-[3px] border-ink bg-violet px-4 py-20 sm:px-8 sm:py-28">
            <div aria-hidden="true" className="absolute -bottom-16 -left-14 size-56 rotate-12 border-[3px] border-ink/15" />
            <div className="relative mx-auto max-w-[1000px] text-center">
              <Reveal>
                <div className="mx-auto mb-6 grid size-16 place-items-center border-[3px] border-ink bg-acid shadow-[5px_5px_0_var(--palette-ink)]"><Zap size={28} fill="currentColor" strokeWidth={3} /></div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em]">Your next schema can be less chaotic</p>
                <h2 className="mx-auto mt-4 max-w-4xl text-5xl font-black leading-[0.84] tracking-[-0.09em] sm:text-7xl md:text-8xl">Make the messy<br className="sm:hidden" /> stuff <span className="bg-paper px-2">make sense.</span></h2>
                <p className="mx-auto mt-6 max-w-xl text-sm font-semibold leading-6 sm:text-base">Bring the tables. Bring the weird field names. Build the model, connect the dots, and leave with code you can use.</p>
                <StartLink className="group mt-8 inline-flex items-center gap-3 border-[3px] border-ink bg-acid px-6 py-4 text-sm font-black shadow-[6px_6px_0_var(--palette-ink)] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_var(--palette-ink)]">
                  Open DBFY <ArrowUpRight size={18} strokeWidth={3} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </StartLink>
              </Reveal>
            </div>
          </section>

          <footer className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-7 text-[10px] font-black uppercase tracking-wider sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
            <Link href="/" className="tracking-[-0.06em]">DBFY<span className="text-brand">.</span> <span className="ml-2 text-neutral-500">Database schemas, un-messified.</span></Link>
            <div className="flex items-center gap-4 text-neutral-600"><a href="#top" className="hover:text-ink">Back to top ↑</a><Link href="/playground" className="hover:text-ink">Workspace</Link></div>
          </footer>
        </main>
      </MotionConfig>
    </ReactLenis>
  );
}
