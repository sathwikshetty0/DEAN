'use client';

/**
 * @fileoverview UI Component for EmergencyContacts
 * Implements functionality related to the D-EAN platform's presentation layer.
 */

import React, { useState, useEffect } from 'react';
import { Phone, Plus, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_HOTLINES, CONTACTS_STORAGE_KEY, EmergencyHotline } from '@/lib/constants/emergency';

export const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<EmergencyHotline[]>(DEFAULT_HOTLINES);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONTACTS_STORAGE_KEY);
      if (saved) setContacts(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const addContact = () => {
    if (newName && newPhone) {
      setContacts([...contacts, { id: Date.now().toString(), name: newName, phone: newPhone }]);
      setNewName('');
      setNewPhone('');
      setShowAdd(false);
    }
  };

  const removeContact = (id: string) => {
    if (DEFAULT_HOTLINES.some((h) => h.id === id)) return;
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const isDefault = (id: string) => DEFAULT_HOTLINES.some((h) => h.id === id);

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-2xl p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-extrabold font-syne flex items-center gap-2">
          <Phone className="w-4 h-4 text-[var(--red-sos)]" />
          Emergency Contacts
        </h3>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="p-2 bg-[var(--red-sos)]/10 hover:bg-[var(--red-sos)]/20 rounded-full transition-colors"
        >
          {showAdd ? <X className="w-4 h-4 text-[var(--red-sos)]" /> : <Plus className="w-4 h-4 text-[var(--red-sos)]" />}
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6 space-y-3"
          >
            <input
              type="text"
              placeholder="Contact Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl px-4 py-2 text-sm outline-none focus:border-[var(--red-sos)]/50"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl px-4 py-2 text-sm outline-none focus:border-[var(--red-sos)]/50"
            />
            <button
              type="button"
              onClick={addContact}
              className="w-full bg-[var(--red-sos)] text-white text-xs font-bold py-3 rounded-xl hover:opacity-90 transition-colors"
            >
              Add Contact
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="group relative bg-[var(--bg-tertiary)]/50 border border-[var(--border-default)] rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-primary)] flex items-center justify-center">
                <User className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">{contact.name}</h4>
                <p className="text-xs text-[var(--text-muted)]">{contact.phone}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4 text-green-500" />
              </a>
              {!isDefault(contact.id) && (
                <button
                  type="button"
                  onClick={() => removeContact(contact.id)}
                  className="p-2 bg-[var(--bg-primary)] hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4 text-[var(--text-muted)] hover:text-red-500" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// Added for debugging purposes
EmergencyContacts.displayName = 'EmergencyContacts';
