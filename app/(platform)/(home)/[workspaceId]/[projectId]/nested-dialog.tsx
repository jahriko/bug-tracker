"use client"
import { Dialog, DialogDescription, DialogBody, DialogActions } from "@/components/catalyst/dialog"
import { Field, Label } from "@/components/catalyst/fieldset"
import { Input } from "@/components/catalyst/input"
import { Button } from "@/components/catalyst/button"
import { useState } from "react"

export default function NestedDialog({ isOpen, setOpen }) {
  return (
    <Dialog open={isOpen} onClose={setOpen}>
      <DialogDescription>
        The refund will be reflected in the customer’s bank account 2 to 3
        business days after processing.
      </DialogDescription>
      <DialogBody>
        <Field>
          <Label>Amount</Label>
          <Input name="amount" placeholder="$0.00" />
        </Field>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
