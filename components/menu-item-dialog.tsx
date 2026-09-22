"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { PublicMenuItem } from "@/lib/api/menu";
import styles from "./menu-item-dialog.module.css";

const price = (value: string) => `Rs. ${Number(value).toLocaleString("en-PK", { maximumFractionDigits: 2 })}`;
const availability: Record<PublicMenuItem["status"], string> = {
  AVAILABLE: "Available",
  OUT_OF_STOCK: "Out of stock",
  INACTIVE: "Unavailable",
};

/** Presentational dialog: all details come from its prop, with no data requests. */
export function MenuItemDialog({ item, onClose }: {
  item: PublicMenuItem;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, []);

  return createPortal(
    <dialog ref={dialogRef} className={styles.dialog}
      aria-labelledby={titleId}
      aria-describedby={item.description ? descriptionId : undefined}
      onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <div className={styles.heading}>
        <h2 id={titleId}>{item.name}</h2>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Close item details" autoFocus>
          <X aria-hidden="true" />
        </button>
      </div>
      {item.image && (
        <div className={styles.image}>
          <Image src={item.image} alt={item.name} fill unoptimized sizes="(max-width: 640px) 90vw, 560px" />
        </div>
      )}
      <div className={styles.content}>
        {item.category && <p className={styles.category}>{item.category.name}</p>}
        {item.description && <p id={descriptionId}>{item.description}</p>}
        <p className={styles.price}>
          <strong>{price(item.discount_price ?? item.price)}</strong>
          {item.discount_price !== null && <del>{price(item.price)}</del>}
        </p>
        {item.ingredients && <p><strong>Ingredients: </strong>{item.ingredients}</p>}
        <p>{availability[item.status]}</p>
      </div>
    </dialog>,
    document.body,
  );
}
