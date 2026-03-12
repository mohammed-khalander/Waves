"use client";


import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
  type DialogPopupProps,
} from '@/components/animate-ui/components/base/dialog';


import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import TextAreaAutosize from "react-textarea-autosize";
import { Controller } from 'react-hook-form';
import { usePromptForm } from './use-prompt-form';
import { Hint } from '@/components/hint';
import { LoaderIcon } from 'lucide-react';





interface BaseDialogDemoProps {
  from: DialogPopupProps['from'];
  showCloseButton: boolean;
}

export const PromptDialogue = ({
  from,
  showCloseButton,
}: BaseDialogDemoProps) => {

    const { form, onSubmit, isPending } = usePromptForm();



  return (
    <Dialog>
        <DialogTrigger
          render={<Button className='rounded-xl px-5 text-base' size="lg" >Start Building</Button>}
        />

        <DialogPopup
          from={from}
          showCloseButton={showCloseButton}
          className="sm:max-w-106.25 w-150 "
        >
        <form id="prompt-submission" onSubmit={form.handleSubmit(onSubmit)}  >
          <DialogHeader>
            <DialogTitle>Bring Your Idea to Life</DialogTitle>
            <DialogDescription>
             Turn your vision into a beautifully crafted website. Just describe what you want to build.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <FieldGroup>
                  <Controller
                    name="prompt"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} >
                        <TextAreaAutosize
                          {...field}
                          disabled={isPending}
                          id="waves-prompt"
                          aria-invalid={fieldState.invalid}
                          placeholder="Ask Waves to create the landing page"
                          autoComplete="off"
                          minRows={10} 
                          className="w-full outline-none bg-muted p-2 rounded-md mt-2"
                          onKeyDown={(e)=>{ 
                              if(e.key==="Enter" && (e.ctrlKey || e.metaKey)){
                                  e.preventDefault();
                                  form.handleSubmit(onSubmit)(e);
                              }
                          }}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
          </div>
          <DialogFooter className='mt-2'>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Hint text="Ctrl+Enter to submit" side="bottom" >
                <Button type="submit" disabled={isPending} >
                    {
                        isPending?
                        <LoaderIcon className='animate-spin'/>:
                        "Submit"
                    }
                </Button>
            </Hint>
          </DialogFooter>
      </form>
        </DialogPopup>
    </Dialog>
  );
};