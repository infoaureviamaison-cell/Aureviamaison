"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight } from "@esmate/shadcn/pkgs/lucide-react"

interface BlogImage {
  url: string
  altText?: string | null
}

interface Article {
  id: string
  title: string
  handle: string
  publishedAt: string
  content: string
  image?: BlogImage | null
  blogHandle: string
}

interface BlogSectionProps {
  articles?: Article[]
}

const AUTOPLAY_MS = 5000

export default function BlogSection({ articles: initialArticles }: BlogSectionProps) {
  const articles = initialArticles || []
  const scrollRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const checkScrollPosition = useCallback(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollEl
    setShowLeftArrow(scrollLeft > 10)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }, [])

  useEffect(() => {
    checkScrollPosition()
    window.addEventListener("resize", checkScrollPosition)
    return () => window.removeEventListener("resize", checkScrollPosition)
  }, [checkScrollPosition, articles.length])

  const getStep = (row: HTMLDivElement) => {
    const card = row.firstElementChild as HTMLElement | null
    return (card?.offsetWidth || row.clientWidth / 2) + parseFloat(getComputedStyle(row).columnGap || "0")
  }

  const scrollLeft = useCallback(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    const cardWidth = getStep(scrollEl)
    scrollEl.scrollBy({ left: -cardWidth, behavior: "smooth" })
  }, [])

  const scrollRight = useCallback(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    const cardWidth = getStep(scrollEl)
    scrollEl.scrollBy({ left: cardWidth, behavior: "smooth" })
  }, [])

  /**
   * Auto-advance: scroll to show next set of articles every 5 seconds
   */
  useEffect(() => {
    if (articles.length <= 2 || isPaused || isDragging) return

    const timer = window.setInterval(() => {
      const scrollEl = scrollRef.current
      if (!scrollEl) return

      const { scrollLeft, scrollWidth, clientWidth } = scrollEl
      const maxScroll = scrollWidth - clientWidth

      if (scrollLeft >= maxScroll - 10) {
        // Reset to beginning
        scrollEl.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        const cardWidth = getStep(scrollEl)
        scrollEl.scrollBy({ left: cardWidth, behavior: "smooth" })
      }
    }, AUTOPLAY_MS)

    return () => window.clearInterval(timer)
  }, [isPaused, isDragging, articles.length])

  if (!articles.length) return null

  return (
    <section className="bg-[#fffaf8] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <span className="inline-flex rounded-full border border-[#ead5cc] bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#a85460]">
              Beauty Journal
            </span>
            <h2 className="mt-3 font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
              From the journal
            </h2>
            <p className="mt-2 hidden max-w-2xl text-base text-gray-600 sm:block sm:text-lg">
              Beauty guidance, thoughtful routines, and inspiration for a more confident everyday style.
            </p>
          </div>
          <Link href="/blogs" className="group mb-2 inline-flex shrink-0 items-center gap-2 self-center rounded-full border border-[#d8a9b1] bg-white px-4 py-2.5 text-xs font-bold text-[#9f4050] transition hover:border-[#9f4050] hover:bg-[#9f4050] hover:text-white sm:mb-4 sm:px-5 sm:text-sm">
            View all posts
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Blog grid or horizontal scrollable carousel */}
        <div className="relative mt-8">
          <div
            ref={scrollRef}
            className={`flex gap-4 overflow-x-auto pb-2 scrollbar-hide sm:gap-6 ${isDragging ? "cursor-grabbing select-none" : "cursor-grab snap-x snap-mandatory"}`}
            onDragStart={(event) => event.preventDefault()}
            onPointerDown={(event) => {
              drag.current.moved = false
              if (event.pointerType !== "mouse" || event.button !== 0) return
              drag.current = { active: true, moved: false, startX: event.clientX, startLeft: event.currentTarget.scrollLeft }
            }}
            onPointerMove={(event) => {
              if (!drag.current.active) return
              const distance = event.clientX - drag.current.startX
              if (Math.abs(distance) > 5 && !drag.current.moved) {
                drag.current.moved = true
                event.currentTarget.setPointerCapture(event.pointerId)
                setIsDragging(true)
              }
              if (drag.current.moved) event.currentTarget.scrollLeft = drag.current.startLeft - distance
            }}
            onPointerUp={(event) => {
              drag.current.active = false
              setIsDragging(false)
              if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
            }}
            onPointerCancel={() => { drag.current.active = false; setIsDragging(false) }}
            onClickCapture={(event) => {
              if (drag.current.moved) { event.preventDefault(); event.stopPropagation(); drag.current.moved = false }
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => { setIsPaused(false); if (!drag.current.moved) drag.current.active = false }}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false) }}
            onScroll={checkScrollPosition}
          >
            {articles.map((article) => {
              const text = article.content?.replace(/<[^>]+>/g, "").trim() ?? ""

              return (
                <div
                  key={article.id}
                  className="flex w-[88%] shrink-0 snap-start items-stretch sm:w-[calc((100%_-_1.5rem)/2)]"
                >
                  <article className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-[#e8ddd7] bg-white shadow-[0_8px_30px_rgba(69,44,35,0.07)] transition duration-500 hover:-translate-y-1 hover:border-[#d9b5b8] hover:shadow-[0_18px_42px_rgba(69,44,35,0.12)]">
                    <div className="absolute inset-x-0 top-0 z-20 h-1 bg-gradient-to-r from-[#bd6875] via-[#d7a887] to-[#d9bd76]" />
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f5efeb]">
                      {article.image?.url ? (
                        <Image
                          src={article.image.url}
                          alt={article.image.altText || article.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 88vw, 48vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-col p-4 sm:px-5 sm:py-4">
                      <h3 className="line-clamp-1 font-serif text-base font-bold leading-snug text-[#241b18] sm:text-xl">
                        <Link
                          href={`/blog/${article.handle}`}
                          className="transition-colors hover:text-[#a85460]"
                        >
                          {article.title}
                        </Link>
                      </h3>

                      <div className="mt-2 flex min-w-0 items-center justify-between gap-4">
                        <p className="min-w-0 flex-1 truncate text-xs text-gray-600 sm:text-sm">{text}</p>
                        <Link
                          href={`/blog/${article.handle}`}
                          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-[#9f4050] transition hover:gap-2.5 sm:text-sm"
                        >
                          Learn more <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              )
            })}
          </div>

          {/* Navigation arrows */}
          {articles.length > 2 && (
            <>
              {showLeftArrow && (
                <button
                  type="button"
                  onClick={scrollLeft}
                  aria-label="Scroll left"
                  className="group absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#e5d7d0] bg-white p-2.5 text-[#513a32] shadow-lg transition-all duration-300 hover:scale-105 hover:text-[#a85460] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#a85460]/20 sm:-left-3"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-slate-800 transition-transform duration-300 group-hover:-translate-x-0.5" />
                </button>
              )}

              {showRightArrow && (
                <button
                  type="button"
                  onClick={scrollRight}
                  aria-label="Scroll right"
                  className="group absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#e5d7d0] bg-white p-2.5 text-[#513a32] shadow-lg transition-all duration-300 hover:scale-105 hover:text-[#a85460] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#a85460]/20 sm:-right-3"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-slate-800 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              )}
            </>
          )}
        </div>

      </div>
    </section>
  )
}
