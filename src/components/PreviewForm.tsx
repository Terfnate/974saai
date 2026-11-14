import { useState, type FormEvent, type ReactNode } from 'react';

/**
 * Form shell with validation and a honeypot. There is no inbox yet, so a valid submit shows `preview`
 * instead of sending. To go live, post the FormData to an API route inside onSubmit.
 */
export function PreviewForm({ label, submit, preview, children, className = '', check }: { label: string; submit: string; preview: string; children: ReactNode; className?: string; check?: () => string | null }) {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const problem = check?.();
    if (problem) { setMsg({ ok: false, text: problem }); return; }
    if (!f.reportValidity()) { setMsg(null); return; }
    if ((f.elements.namedItem('company_site') as HTMLInputElement | null)?.value) return; // bot
    setMsg({ ok: true, text: preview });
  };
  return (
    <form className={`form ${className}`} onSubmit={onSubmit} noValidate aria-label={label}>
      {children}
      <input type="text" name="company_site" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <div className="form__foot">
        <button className="btn btn--primary" type="submit">{submit}</button>
        <p className={`form__status${msg && !msg.ok ? ' is-error' : ''}`} role="status">{msg?.text ?? ''}</p>
      </div>
    </form>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="field">
      <span>{label}{hint ? <em> {hint}</em> : null}</span>
      {children}
    </label>
  );
}

export function Chips({ legend, name, options, type = 'radio' }: { legend: string; name: string; options: readonly string[]; type?: 'radio' | 'checkbox' }) {
  return (
    <fieldset className="form__roles">
      <legend>{legend}</legend>
      {options.map((o, i) => (
        <label key={o} className="chip">
          <input type={type} name={name} value={o} defaultChecked={type === 'radio' && i === 0} />
          <span>{o}</span>
        </label>
      ))}
    </fieldset>
  );
}
