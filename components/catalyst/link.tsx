/*
TODO: Update this component to use your client-side framework's link
component. We've provided examples of how to do this for Next.js,
Remix, and Inertia.js in the Catalyst documentation:

https://catalyst.tailwindui.com/docs#client-side-router-integration
*/
"use client"

import * as Headless from "@headlessui/react"
import React from "react"
import NextLink, { type LinkProps } from "next/link"

export const Link = React.forwardRef(function Link(
  props: LinkProps & React.ComponentPropsWithoutRef<"a">,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  return (
    <Headless.DataInteractive>
      {/* <a {...props} ref={ref} /> */}
      <NextLink {...props} ref={ref} />
    </Headless.DataInteractive>
  )
})
