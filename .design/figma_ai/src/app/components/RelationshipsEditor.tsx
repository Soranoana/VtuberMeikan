import { useState } from 'react';
import { Plus, X, User, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { VTuberProfile, VTuberRelationship } from '../types';

interface RelationshipsEditorProps {
  relationships: VTuberRelationship[];
  onChange: (rels: VTuberRelationship[]) => void;
  allProfiles: VTuberProfile[];
  currentProfileId?: string;
}

function resolveProfile(id: string, allProfiles: VTuberProfile[]): VTuberProfile | undefined {
  return allProfiles.find(p => p.id === id);
}

function ProfileChip({ profile }: { profile: VTuberProfile }) {
  const img = profile.imageUrls?.[0] ?? profile.imageUrl;
  return (
    <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 rounded-full px-2.5 py-1">
      {img ? (
        <img src={img} alt={profile.name} className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
      ) : (
        <div className="w-5 h-5 rounded-full bg-violet-200 flex items-center justify-center flex-shrink-0">
          <User className="w-3 h-3 text-violet-600" />
        </div>
      )}
      <span className="text-xs font-medium text-violet-800 max-w-[120px] truncate">{profile.name}</span>
    </div>
  );
}

function IdStatusMessage({ id, allProfiles, currentProfileId, usedIds }: {
  id: string;
  allProfiles: VTuberProfile[];
  currentProfileId?: string;
  usedIds: Set<string>;
}) {
  if (!id.trim()) return null;

  if (id === currentProfileId) {
    return <p className="text-xs text-red-500 mt-1">自分自身は指定できません</p>;
  }
  if (usedIds.has(id)) {
    return <p className="text-xs text-orange-500 mt-1">すでに登録されています</p>;
  }

  const found = resolveProfile(id, allProfiles);
  if (found) {
    return (
      <div className="mt-1.5 flex items-center gap-2">
        <ProfileChip profile={found} />
        <span className="text-xs text-green-600 font-medium">✓ 確認済み</span>
      </div>
    );
  }
  return <p className="text-xs text-gray-400 mt-1">該当するVTuberが見つかりません（IDを確認してください）</p>;
}

export function RelationshipsEditor({
  relationships,
  onChange,
  allProfiles,
  currentProfileId,
}: RelationshipsEditorProps) {
  const [inputId, setInputId] = useState('');
  const [inputLabel, setInputLabel] = useState('');

  const usedIds = new Set(relationships.map(r => r.targetId));

  const canAdd = (() => {
    if (!inputId.trim() || !inputLabel.trim()) return false;
    if (inputId === currentProfileId) return false;
    if (usedIds.has(inputId)) return false;
    return true;
  })();

  const handleAdd = () => {
    if (!canAdd) return;
    const newRel: VTuberRelationship = {
      targetId: inputId.trim(),
      label: inputLabel.trim(),
      direction: 'to',
    };
    onChange([...relationships, newRel]);
    setInputId('');
    setInputLabel('');
  };

  const handleRemove = (idx: number) => {
    onChange(relationships.filter((_, i) => i !== idx));
  };

  const handleUpdateLabel = (idx: number, label: string) => {
    onChange(relationships.map((r, i) => i === idx ? { ...r, label } : r));
  };

  return (
    <div className="space-y-4">

      {/* 登録済みリスト */}
      {relationships.length > 0 && (
        <div className="space-y-2">
          {relationships.map((rel, idx) => {
            const target = resolveProfile(rel.targetId, allProfiles);
            return (
              <div key={idx} className="border-2 border-violet-100 rounded-lg p-3 bg-violet-50/40 flex flex-col sm:flex-row sm:items-center gap-2">

                {/* 相手VTuber情報 */}
                <div className="flex items-center gap-2 min-w-0 sm:w-56 flex-shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    {target ? (
                      <ProfileChip profile={target} />
                    ) : (
                      <span className="text-xs text-gray-400">ID: {rel.targetId}</span>
                    )}
                    <span className="text-[10px] text-gray-400 mt-0.5 pl-1">ID: {rel.targetId}</span>
                  </div>
                </div>

                {/* ラベル編集 */}
                <Input
                  value={rel.label}
                  onChange={e => handleUpdateLabel(idx, e.target.value)}
                  placeholder="関係値"
                  className="border-violet-200 focus:border-violet-400 bg-white text-sm h-8 flex-1"
                />

                {/* 削除 */}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 self-start sm:self-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {relationships.length === 0 && (
        <p className="text-sm text-gray-400 py-1">関係値がまだ登録されていません。</p>
      )}

      {/* 追加フォーム */}
      <div className="border-2 border-dashed border-violet-200 rounded-lg p-4 space-y-3 bg-white">
        <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide">関係値を追加</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* プロフィールID入力 */}
          <div>
            <Label className="text-sm text-gray-700 mb-1.5 block">
              プロフィールID <span className="text-red-500">*</span>
            </Label>
            <Input
              value={inputId}
              onChange={e => setInputId(e.target.value)}
              placeholder="例: 2"
              className="border-violet-200 focus:border-violet-400 text-sm"
            />
            <IdStatusMessage
              id={inputId}
              allProfiles={allProfiles}
              currentProfileId={currentProfileId}
              usedIds={usedIds}
            />
          </div>

          {/* 関係値入力 */}
          <div>
            <Label className="text-sm text-gray-700 mb-1.5 block">
              関係値 <span className="text-red-500">*</span>
            </Label>
            <Input
              value={inputLabel}
              onChange={e => setInputLabel(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
              placeholder="例: 仲良し、師匠、コラボ仲間"
              className="border-violet-200 focus:border-violet-400 text-sm"
            />
          </div>
        </div>

        <Button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-40"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          追加
        </Button>
      </div>

    </div>
  );
}
