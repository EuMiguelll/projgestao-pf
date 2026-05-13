import { useEffect, useRef, useState } from 'react';
import Modal from './Modal.jsx';

const empty = { code: '', name: '', instructor_name: '', status: 'DISPONIVEL' };

export default function NewCourseModal({ open, onClose, onSubmit }) {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const codeRef = useRef(null);

  useEffect(() => {
    if (open) {
      setValues(empty);
      setErrors({});
      setSubmitting(false);
    }
  }, [open]);

  const setField = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((e2) => ({ ...e2, [k]: undefined, form: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!values.code.trim()) errs.code = 'Informe o código';
    else if (values.code.trim().length > 32) errs.code = 'Máximo 32 caracteres';
    if (!values.name.trim()) errs.name = 'Informe o nome';
    else if (values.name.trim().length > 200) errs.name = 'Máximo 200 caracteres';
    if (!values.instructor_name.trim()) errs.instructor_name = 'Informe o instrutor';
    else if (values.instructor_name.trim().length > 200) errs.instructor_name = 'Máximo 200 caracteres';
    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        code: values.code.trim(),
        name: values.name.trim(),
        instructor_name: values.instructor_name.trim(),
        status: values.status,
      });
      onClose();
    } catch (err) {
      if (err?.status === 409) {
        setErrors({ code: 'Já existe um curso com este código' });
      } else {
        setErrors({ form: err?.message || 'Não foi possível cadastrar o curso' });
      }
      setSubmitting(false);
    }
  };

  const footer = (
    <>
      <button type="button" onClick={onClose} className="btn-ghost" disabled={submitting}>
        Cancelar
      </button>
      <button type="submit" form="new-course-form" className="btn-primary" disabled={submitting}>
        {submitting ? 'Cadastrando…' : 'Cadastrar curso'}
      </button>
    </>
  );

  return (
    <Modal open={open} onClose={submitting ? () => {} : onClose} title="Novo curso" footer={footer} initialFocusRef={codeRef}>
      <form id="new-course-form" onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label htmlFor="code" className="label">Código</label>
          <input
            ref={codeRef}
            id="code"
            data-autofocus
            type="text"
            className="input font-mono uppercase tracking-wider"
            placeholder="ENG-101"
            value={values.code}
            onChange={setField('code')}
            maxLength={32}
            aria-invalid={!!errors.code}
            aria-describedby={errors.code ? 'code-error' : undefined}
          />
          {errors.code ? <p id="code-error" className="mt-1 text-xs text-danger">{errors.code}</p> : null}
        </div>

        <div>
          <label htmlFor="name" className="label">Nome do curso</label>
          <input
            id="name"
            type="text"
            className="input"
            placeholder="Engenharia de Software"
            value={values.name}
            onChange={setField('name')}
            maxLength={200}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name ? <p id="name-error" className="mt-1 text-xs text-danger">{errors.name}</p> : null}
        </div>

        <div>
          <label htmlFor="instructor" className="label">Instrutor</label>
          <input
            id="instructor"
            type="text"
            className="input"
            placeholder="Prof. Dra. Helena Mota"
            value={values.instructor_name}
            onChange={setField('instructor_name')}
            maxLength={200}
            aria-invalid={!!errors.instructor_name}
            aria-describedby={errors.instructor_name ? 'instructor-error' : undefined}
          />
          {errors.instructor_name ? (
            <p id="instructor-error" className="mt-1 text-xs text-danger">{errors.instructor_name}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="status" className="label">Status</label>
          <select id="status" className="select" value={values.status} onChange={setField('status')}>
            <option value="DISPONIVEL">Disponível</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

        {errors.form ? (
          <div className="px-3 py-2 text-sm text-danger bg-danger/5 border border-danger/30 rounded-lg">
            {errors.form}
          </div>
        ) : null}
      </form>
    </Modal>
  );
}
