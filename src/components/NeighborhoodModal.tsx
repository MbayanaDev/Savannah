import React, { useState } from 'react';
import {
  X,
  MapPin,
  Search,
  Check,
  Clock,
  Zap,
  Home,
  Briefcase,
  Users,
  Plus,
  Pencil,
  ArrowLeftRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { NAIROBI_NEIGHBORHOODS } from '../data/neighborhoods';
import { NairobiNeighborhood, SavedAddress } from '../types';

export const NeighborhoodModal: React.FC = () => {
  const {
    isNeighborhoodModalOpen,
    setIsNeighborhoodModalOpen,
    selectedNeighborhood,
    setSelectedNeighborhood,
    savedAddresses,
    selectedAddressId,
    selectAddress,
    deliveryZones,
    isLoadingAddresses,
    isLoadingDeliveryZones,
    addSavedAddress,
    updateSavedAddress,
    setDefaultSavedAddress,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'saved' | 'all'>('saved');
  const [search, setSearch] = useState('');

  const [isChangingDefault, setIsChangingDefault] = useState(false);

  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);
  const [isReplacingAddress, setIsReplacingAddress] = useState<boolean>(false);
  const [addressToReplaceId, setAddressToReplaceId] = useState<string>('');

  const [editForm, setEditForm] = useState({
    label: '',
    street: '',
    region: '',
    apartment: '',
    reference: '',
    instructions: ''
  });

  if (!isNeighborhoodModalOpen) return null;

  const getZoneName = (zoneId: string) =>
    deliveryZones.find(zone => zone.zone_id === zoneId)?.name ?? zoneId;

  const handleSelectDefault = async (id: string) => {
    try {
      await setDefaultSavedAddress(id);
      selectAddress(id);

      const address = savedAddresses.find(item => item.id === id);
      showToast(
        `Default delivery address changed to ${address?.label || 'selected address'}`,
        'success'
      );

      setIsChangingDefault(false);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Could not change the default address.',
        'warning'
      );
    }
  };

  const handleOpenEdit = (address: SavedAddress) => {
    setIsAddingAddress(false);
    setIsReplacingAddress(false);
    setEditingAddress(address);

    setEditForm({
      label: address.label,
      street: address.street,
      region: address.deliveryZoneId,
      apartment: address.apartment,
      reference: address.reference || '',
      instructions: address.instructions || ''
    });
  };

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsReplacingAddress(false);

    setEditForm({
      label: '',
      street: '',
      region: deliveryZones[0]?.zone_id ?? '',
      apartment: '',
      reference: '',
      instructions: ''
    });

    setIsAddingAddress(true);
  };

  const handleOpenReplace = () => {
    setEditingAddress(null);
    setIsAddingAddress(false);

    const initialAddress = savedAddresses[0];

    if (!initialAddress) {
      handleOpenAdd();
      return;
    }

    setAddressToReplaceId(initialAddress.id);

    setEditForm({
      label: '',
      street: '',
      region: deliveryZones[0]?.zone_id ?? '',
      apartment: '',
      reference: '',
      instructions: ''
    });

    setIsReplacingAddress(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !editForm.label.trim() ||
      !editForm.street.trim() ||
      !editForm.apartment.trim() ||
      !editForm.region
    ) {
      showToast('Please complete all required address fields.', 'warning');
      return;
    }

    const addressFields = {
      label: editForm.label.trim(),
      tag: editForm.label.trim(),
      street: editForm.street.trim(),
      region: getZoneName(editForm.region),
      deliveryZoneId: editForm.region,
      apartment: editForm.apartment.trim(),
      reference: editForm.reference.trim(),
      instructions: editForm.instructions.trim(),
      iconName: 'pin' as const
    };

    try {
      if (isReplacingAddress) {
        const targetAddress = savedAddresses.find(
          address => address.id === addressToReplaceId
        );

        if (!targetAddress) {
          showToast('Select an address to replace.', 'warning');
          return;
        }

        await updateSavedAddress({
          ...targetAddress,
          ...addressFields
        });

        selectAddress(targetAddress.id);
        showToast(`Replaced "${targetAddress.label}" with "${addressFields.label}"`, 'success');
        setIsReplacingAddress(false);
        return;
      }

      if (isAddingAddress) {
        const newAddress = await addSavedAddress(addressFields);

        selectAddress(newAddress.id);
        showToast(`Added new address "${newAddress.label}"`, 'success');
        setIsAddingAddress(false);
        return;
      }

      if (editingAddress) {
        await updateSavedAddress({
          ...editingAddress,
          ...addressFields
        });

        showToast(`Saved changes to "${addressFields.label}"`, 'success');
        setEditingAddress(null);
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Could not save the address.',
        'warning'
      );
    }
  };

  const filteredNeighborhoods = NAIROBI_NEIGHBORHOODS.filter(n =>
    n.name.toLowerCase().includes(search.toLowerCase()) ||
    n.popularEstate.toLowerCase().includes(search.toLowerCase()) ||
    n.zone.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectNeighborhood = (n: NairobiNeighborhood) => {
    setSelectedNeighborhood(n);
    setIsNeighborhoodModalOpen(false);
    showToast(`Delivery area set to ${n.name} (KES ${n.deliveryFee})`, 'info');
  };

  const handleSelectSaved = (addr: SavedAddress) => {
    selectAddress(addr.id);
    setIsNeighborhoodModalOpen(false);
  };

  const getAddressIcon = (iconName?: string) => {
    switch (iconName) {
      case 'home':
        return <Home className="w-3.5 h-3.5 text-emerald-700 shrink-0" />;
      case 'work':
        return <Briefcase className="w-3.5 h-3.5 text-stone-600 shrink-0" />;
      case 'friend':
      case 'family':
        return <Users className="w-3.5 h-3.5 text-stone-600 shrink-0" />;
      default:
        return <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />;
    }
  };

  const preferredAddress =
    savedAddresses.find(address => address.isDefault) ?? savedAddresses[0];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
    >
      <div 
        className="relative w-full max-w-xl bg-[#FCFBF8] rounded-xl overflow-hidden shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: matching body background color, exactly like Orders and Tracking */}
        <div className="px-5 py-4 bg-[#FCFBF8] border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <MapPin className="w-5 h-5 text-[#173b28] shrink-0" />
            <h3 className="font-display font-extrabold text-base sm:text-lg text-stone-900 tracking-tight truncate">
              Delivery Addresses
            </h3>
          </div>

          <button
            onClick={() => {
              setIsNeighborhoodModalOpen(false);
              setEditingAddress(null);
              setIsAddingAddress(false);
              setIsReplacingAddress(false);
            }}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close delivery addresses modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Switcher: Saved Addresses vs All Nairobi Areas */}
        <div className="flex items-center border-b border-stone-200/80 bg-[#F7F6F2] px-4 pt-1.5 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`pb-2.5 px-3 text-xs font-semibold transition-all relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'text-[#173b28] border-b-2 border-[#173b28]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>Saved Addresses</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#173b28]/10 text-[#173b28]">
              {savedAddresses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 px-3 text-xs font-semibold transition-all relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'text-[#173b28] border-b-2 border-[#173b28]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>Service Areas</span>
          </button>
        </div>

        {/* Modal Body */}
        {activeTab === 'saved' ? (
          <div className="overflow-y-auto overscroll-contain flex-1 p-4 sm:p-6 space-y-4">
            {/* Section: Your drop-off locations */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-stone-900 text-sm tracking-tight">
                    Your drop-off locations
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-700">
                    {savedAddresses.length}
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 font-medium">
                  Saved Places
                </span>
              </div>

              {/* Preferred Address Container (Directly below text "Your drop-off locations") */}
              {preferredAddress && (
                <div className="bg-stone-50/70 hover:bg-stone-50 border border-emerald-700/25 rounded-xl p-2.5 sm:p-3 shadow-2xs transition-all relative">
                  {/* Header with Leading Icon, Label, Default badge, and "Change default" CTA */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {getAddressIcon(preferredAddress.iconName)}
                      <span className="font-display font-bold text-stone-900 text-xs truncate">
                        {preferredAddress.label}
                      </span>
                      <span className="text-[9.5px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded leading-none shrink-0">
                        Default
                      </span>
                    </div>
                    {/* "Change default" CTA */}
                    <button
                      type="button"
                      onClick={() => setIsChangingDefault(true)}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 border border-emerald-300/80 rounded-md text-[11px] font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
                    >
                      Change default
                    </button>
                  </div>

                  {/* Compact Content Stack */}
                  <div className="space-y-0.5 text-xs">
                    {/* Row 2: Street / Road and Delivery Region in one row separated by a comma */}
                    <div className="text-stone-800 font-semibold leading-tight break-words">
                      {preferredAddress.street}{preferredAddress.region ? `, ${preferredAddress.region}` : ''}
                    </div>

                    {/* Row 3: Apartment & House Number */}
                    <div className="text-stone-600 text-[11px] leading-tight break-words">
                      {preferredAddress.apartment}
                    </div>

                    {/* Row 4: Reference (smaller font) */}
                    {preferredAddress.reference && (
                      <div className="text-stone-400 text-[10px] leading-tight break-words">
                        {preferredAddress.reference}
                      </div>
                    )}

                    {/* Row 5: Instructions */}
                    {preferredAddress.instructions && (
                      <div className="pt-0.5 text-[10px] text-stone-500 italic leading-tight break-words">
                        &ldquo;{preferredAddress.instructions}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* All Addresses Section: 2-column by n-rows minimalist grid */}
              <div className="space-y-3 pt-2">
                {/* Subheading: All Addresses & dynamic CTA */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-600 uppercase tracking-wider mt-0.5">
                    <span>All Addresses</span>
                    <span className="text-[10px] font-mono px-1 rounded bg-stone-200/70 text-stone-700 font-normal">
                      {savedAddresses.length}
                    </span>
                  </div>
                  <div className="flex flex-col items-end leading-tight">
                    {savedAddresses.length >= 4 ? (
                      <button
                        type="button"
                        onClick={handleOpenReplace}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors cursor-pointer"
                      >
                        <span>replace address</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleOpenAdd}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                        <span>add address</span>
                      </button>
                    )}
                    <span className="text-[10px] text-stone-400 italic">
                      add up to 4 addresses
                    </span>
                  </div>
                </div>

                {/* Saved Addresses: Loading, Empty State, or Address Grid */}
                {isLoadingAddresses ? (
                  <div className="py-8 text-center text-xs text-stone-500">
                    Loading your saved addresses...
                  </div>
                ) : savedAddresses.length === 0 ? (
                  <div className="py-8 px-4 text-center bg-stone-50/70 rounded-xl border border-dashed border-stone-300">
                    <MapPin className="w-6 h-6 text-stone-400 mx-auto mb-2" />

                    <p className="text-sm font-semibold text-stone-700">
                      No saved addresses yet
                    </p>

                    <p className="text-xs text-stone-500 mt-1">
                      Add your first delivery address to make checkout easier.
                    </p>

                    <button
                      type="button"
                      onClick={handleOpenAdd}
                      disabled={isLoadingDeliveryZones || deliveryZones.length === 0}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#173b28] hover:bg-[#1f4e35] text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Delivery Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    {savedAddresses.map((addr) => {
                      const Icon = getAddressIcon(addr.iconName);
                      const isSelected = selectedAddressId === addr.id;

                      return (
                        <div
                          key={addr.id}
                          onClick={() => handleSelectSaved(addr)}
                          className={`group relative flex flex-col justify-between p-3 rounded-xl border transition-all cursor-pointer text-left ${
                            isSelected
                              ? 'bg-emerald-50/20 border-emerald-700 shadow-xs ring-1 ring-emerald-700/20'
                              : 'bg-white hover:bg-stone-50/70 border-stone-200/90 hover:border-stone-300 shadow-2xs'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-1.5 mb-0.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                {Icon}

                                <span className="font-display font-bold text-stone-900 text-xs break-words">
                                  {addr.label}
                                </span>

                                {addr.isDefault && (
                                  <span className="text-[9px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded leading-none shrink-0">
                                    Default
                                  </span>
                                )}

                                {isSelected && (
                                  <span className="text-[9px] font-semibold bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded leading-none shrink-0">
                                    Selected
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEdit(addr);
                                }}
                                className="w-5 h-5 flex items-center justify-center rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer shrink-0"
                                title={`Edit ${addr.label}`}
                                aria-label={`Edit ${addr.label}`}
                              >
                                <Pencil className="w-2.5 h-2.5 text-stone-500" />
                              </button>
                            </div>

                            <div className="text-stone-800 text-xs font-semibold leading-snug break-words">
                              {addr.street}
                            </div>

                            {addr.region && (
                              <div className="text-emerald-800 text-[11px] font-medium leading-snug break-words">
                                {addr.region}
                              </div>
                            )}

                            <div className="text-stone-600 text-[11.5px] leading-snug break-words">
                              {addr.apartment}
                            </div>

                            {addr.reference && (
                              <div className="text-stone-400 text-[10px] leading-tight break-words">
                                {addr.reference}
                              </div>
                            )}

                            {addr.instructions && (
                              <div className="pt-0.5 mt-0.5 text-[10.5px] text-stone-500 italic leading-snug break-words">
                                &ldquo;{addr.instructions}&rdquo;
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: All Nairobi Neighborhoods */
          <div className="flex-1 overflow-hidden flex flex-col bg-white">
            {/* Search input */}
            <div className="p-3.5 border-b border-stone-100 bg-[#FCFBF8]">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by neighborhood, street or estate (e.g. Karen, Rhapta, Gigiri)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173b28]/30 focus:border-[#173b28]"
                  autoFocus
                />
              </div>
            </div>

            {/* Neighborhood Containers List */}
            <div className="p-3.5 sm:p-4 overflow-y-auto overscroll-contain space-y-3 flex-1 bg-[#FCFBF8]">
              {filteredNeighborhoods.map((n) => {
                const isSelected = selectedNeighborhood.id === n.id;
                const subareas = n.popularEstate
                  ? n.popularEstate.split(',').map((s) => s.trim()).filter(Boolean)
                  : [];

                return (
                  <div
                    key={n.id}
                    onClick={() => handleSelectNeighborhood(n)}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer text-left space-y-3 ${
                      isSelected
                        ? 'bg-emerald-50/25 border-emerald-700 shadow-xs ring-1 ring-emerald-700/20'
                        : 'bg-white hover:bg-stone-50/80 border-stone-200/90 hover:border-stone-300 shadow-2xs'
                    }`}
                  >
                    {/* Header of the area & subareas */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                          <h4 className="font-display font-bold text-stone-900 text-sm tracking-tight truncate">
                            {n.name}
                          </h4>
                        </div>
                        {isSelected && (
                          <span className="text-[9.5px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            Current Area
                          </span>
                        )}
                      </div>

                      {/* List of subareas as a text list */}
                      {subareas.length > 0 && (
                        <p className="text-[11px] text-stone-500 leading-snug">
                          {subareas.join(', ')}
                        </p>
                      )}
                    </div>

                    {/* Row with two columns: Express and Scheduled */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                      {/* Column 1: Express */}
                      <div
                        className={`p-2.5 rounded-lg border flex flex-col justify-between gap-1.5 ${
                          n.expressAvailable
                            ? 'bg-amber-50/40 border-amber-200/80'
                            : 'bg-stone-50/60 border-stone-200/60 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="flex items-center gap-1 text-xs font-bold text-stone-900">
                            <Zap
                              className={`w-3 h-3 ${
                                n.expressAvailable ? 'text-amber-600 fill-amber-500' : 'text-stone-400'
                              }`}
                            />
                            Express
                          </span>
                          <span className="text-[11px] font-mono font-semibold text-amber-900">
                            {n.expressAvailable ? `${n.minMins} mins` : 'Unavailable'}
                          </span>
                        </div>

                        <div className="pt-1.5 border-t border-stone-200/60 text-xs">
                          <span className="font-bold text-stone-900 font-mono">
                            {n.expressAvailable ? `KES ${n.deliveryFee}` : '—'}
                          </span>
                        </div>
                      </div>

                      {/* Column 2: Scheduled */}
                      <div className="p-2.5 rounded-lg border bg-stone-50/80 border-stone-200/80 flex flex-col justify-between gap-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="flex items-center gap-1 text-xs font-bold text-stone-900">
                            <Clock className="w-3 h-3 text-stone-600" />
                            Scheduled
                          </span>
                          <span className="text-[11px] font-mono font-semibold text-stone-700">
                            1-3hrs
                          </span>
                        </div>

                        <div className="pt-1.5 border-t border-stone-200/60 text-xs">
                          <span className="font-bold text-stone-900 font-mono">
                            KES {n.deliveryFee}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Text for free delivery threshold */}
                    <p className="text-xs text-stone-600">
                      Shop kes {n.freeThreshold} and more for free delivery
                    </p>
                  </div>
                );
              })}

              {filteredNeighborhoods.length === 0 && (
                <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 text-sm">
                  No neighborhoods found matching &ldquo;{search}&rdquo;. You can also pick from your saved addresses.
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Edit / Add / Replace Address Dialog Modal (Matching Orders and Tracking) */}
      {(editingAddress || isAddingAddress || isReplacingAddress) && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => { setEditingAddress(null); setIsAddingAddress(false); setIsReplacingAddress(false); }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-sm p-5 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                {isReplacingAddress ? (
                  <ArrowLeftRight className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                ) : isAddingAddress ? (
                  <Plus className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                ) : (
                  <Pencil className="w-4 h-4 text-emerald-700" />
                )}
                <h4 className="font-display font-bold text-sm text-stone-900">
                  {isReplacingAddress 
                    ? 'Replace Delivery Address' 
                    : isAddingAddress 
                    ? 'Add Delivery Address' 
                    : 'Edit Delivery Address'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => { setEditingAddress(null); setIsAddingAddress(false); setIsReplacingAddress(false); }}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              {isReplacingAddress && (
                <div className="bg-emerald-50/60 border border-emerald-200/90 p-2.5 rounded-lg space-y-1">
                  <label className="block font-semibold text-emerald-900 text-xs">
                    Select address to replace
                  </label>
                  <select
                    value={addressToReplaceId}
                    onChange={(e) => setAddressToReplaceId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900 text-xs font-medium cursor-pointer"
                  >
                    {savedAddresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.label} — {addr.street}, {addr.region}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-emerald-800/80 leading-tight">
                    The chosen address will be replaced with the new location entered below.
                  </p>
                </div>
              )}

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Place Name / Label
                </label>
                <input
                  type="text"
                  required
                  value={editForm.label}
                  onChange={(e) => setEditForm(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900 font-medium"
                  placeholder="e.g. Home, Work, Apartment"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Street / Road
                </label>
                <input
                  type="text"
                  required
                  value={editForm.street}
                  onChange={(e) => setEditForm(prev => ({ ...prev, street: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
                  placeholder="e.g. Dennis Pritt Road"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Delivery Zone
                </label>

                <select
                  required
                  value={editForm.region}
                  onChange={e =>
                    setEditForm(prev => ({ ...prev, region: e.target.value }))
                  }
                  disabled={isLoadingDeliveryZones || deliveryZones.length === 0}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900 disabled:bg-stone-100"
                >
                  <option value="">
                    {isLoadingDeliveryZones ? 'Loading delivery zones...' : 'Select a delivery zone'}
                  </option>

                  {deliveryZones.map(zone => (
                    <option key={zone.zone_id} value={zone.zone_id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Apartment &amp; House Number
                </label>
                <input
                  type="text"
                  required
                  value={editForm.apartment}
                  onChange={(e) => setEditForm(prev => ({ ...prev, apartment: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
                  placeholder="e.g. Silver Oak Court, Apt 3B"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Reference / Landmark
                </label>
                <input
                  type="text"
                  value={editForm.reference}
                  onChange={(e) => setEditForm(prev => ({ ...prev, reference: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
                  placeholder="e.g. Near Shell petrol station opposite Friends supermarket"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Delivery Instructions
                </label>
                <input
                  type="text"
                  value={editForm.instructions}
                  onChange={(e) => setEditForm(prev => ({ ...prev, instructions: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
                  placeholder="e.g. Ring buzzer 3B. Leave at door if no answer."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => { setEditingAddress(null); setIsAddingAddress(false); setIsReplacingAddress(false); }}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                >
                  {isReplacingAddress ? 'Replace Address' : isAddingAddress ? 'Add Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Default Address Modal Dialog (Matching Orders and Tracking) */}
      {isChangingDefault && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsChangingDefault(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-sm p-5 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <h4 className="font-display font-bold text-sm text-stone-900">
                  Change Default Address
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsChangingDefault(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-500 leading-normal">
              Select which address you would like to set as your primary preferred delivery location:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {savedAddresses.map((addr) => {
                const Icon = getAddressIcon(addr.iconName);
                const isCurrentDefault = addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectDefault(addr.id)}
                    className={`flex items-start justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                      isCurrentDefault
                        ? 'bg-emerald-50/70 border-emerald-600 ring-1 ring-emerald-600/30'
                        : 'bg-white hover:bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="mt-0.5">{Icon}</div>
                      <div className="min-w-0 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-stone-900 text-xs">
                            {addr.label}
                          </span>
                          {isCurrentDefault && (
                            <span className="text-[9px] font-semibold bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded">
                              Current Default
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-600 truncate mt-0.5">
                          {addr.street}, {addr.region}
                        </div>
                        <div className="text-[10px] text-stone-400 truncate">
                          {addr.apartment}
                        </div>
                      </div>
                    </div>

                    {isCurrentDefault ? (
                      <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-semibold hover:underline shrink-0">
                        Select
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsChangingDefault(false)}
                className="px-3.5 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
