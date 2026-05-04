'use client';

import React, { useState } from 'react';
import { Phone, Plus, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

export const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Mangaluru Police', phone: '112' },
    { id: '2', name: 'Ambulance', phone: '108' },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const addContact = () => {
    if (newName && newPhone) {
      setContacts([...contacts, { id: Date.now().toString(), name: newName, phone: newPhone }]);
      setNewName('');
      setNewPhone('');
      setShowAdd(false);
    }
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <div className="bg-[#1C2333]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#FF2D55]" />
          Emergency Contacts
        </h3>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-2 bg-[#FF2D55]/10 hover:bg-[#FF2D55]/20 rounded-full transition-colors"
        >
          {showAdd ? <X className="w-4 h-4 text-[#FF2D55]" /> : <Plus className="w-4 h-4 text-[#FF2D55]" />}
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
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF2D55]/50 transition-colors"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF2D55]/50 transition-colors"
            />
            <button
              onClick={addContact}
              className="w-full bg-[#FF2D55] text-white text-xs font-bold py-3 rounded-xl hover:bg-[#E6294D] transition-colors"
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
            className="group relative bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">{contact.name}</h4>
                <p className="text-slate-400 text-xs">{contact.phone}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${contact.phone}`}
                className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4 text-green-500" />
              </a>
              {contact.id !== '1' && contact.id !== '2' && (
                <button
                  onClick={() => removeContact(contact.id)}
                  className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors group-hover:opacity-100 opacity-0"
                >
                  <X className="w-4 h-4 text-slate-500 hover:text-red-500" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
