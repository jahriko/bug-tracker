export default function ForumLeftContent() {
  return (
    <div className="mb-8 w-full md:mb-0 md:w-[15rem]">
      <div className="no-scrollbar md:sticky md:top-16 md:h-[calc(100dvh-64px)] md:overflow-y-auto md:overflow-x-hidden">
        <div className="md:py-8">
          <div className="flex items-center justify-between md:block">
            {/* Button */}
            <div className="mb-6 xl:hidden">
              <button className="btn bg-indigo-500 text-white hover:bg-indigo-600 md:w-full">Create Post</button>
            </div>
          </div>
          <div className="no-scrollbar -mx-4 flex flex-nowrap overflow-x-scroll px-4 md:block md:space-y-3 md:overflow-auto">
            <div>
              <div className="mb-3 text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Categories</div>
              <ul className="mr-3 flex flex-nowrap md:mr-0 md:block">
                <li className="mr-0.5 md:mb-0.5 md:mr-0">
                  <a className="flex items-center whitespace-nowrap rounded px-2.5 py-2" href="#0">
                    <svg className="mr-3 h-3 w-3 shrink-0 fill-current text-emerald-500" viewBox="0 0 12 12">
                      <path d="M6 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2A6 6 0 1 1 6 0a6 6 0 0 1 0 12Z" />
                    </svg>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Startups</span>
                  </a>
                </li>
                <li className="mr-0.5 md:mb-0.5 md:mr-0">
                  <a className="flex items-center whitespace-nowrap rounded px-2.5 py-2" href="#0">
                    <svg className="mr-3 h-3 w-3 shrink-0 fill-current text-rose-500" viewBox="0 0 12 12">
                      <path d="M6 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2A6 6 0 1 1 6 0a6 6 0 0 1 0 12Z" />
                    </svg>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Javascript</span>
                  </a>
                </li>
                <li className="mr-0.5 md:mb-0.5 md:mr-0">
                  <a className="flex items-center whitespace-nowrap rounded px-2.5 py-2" href="#0">
                    <svg className="mr-3 h-3 w-3 shrink-0 fill-current text-amber-500" viewBox="0 0 12 12">
                      <path d="M6 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2A6 6 0 1 1 6 0a6 6 0 0 1 0 12Z" />
                    </svg>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Productivity</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
