import type { NextApiRequest, NextApiResponse } from 'next';
import { sampleProfiles } from '../../../src/app/data/sampleData';

function serialize(profile: any) {
  return {
    ...profile,
    createdAt: profile.createdAt ? new Date(profile.createdAt).toISOString() : null,
    updatedAt: profile.updatedAt ? new Date(profile.updatedAt).toISOString() : null,
  };
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
    body,
  } = req;

  const idx = (sampleProfiles as any).findIndex((p: any) => p.id === id);
  const profile = idx >= 0 ? (sampleProfiles as any)[idx] : null;

  if (method === 'GET') {
    if (!profile) return res.status(404).json({ message: 'Not found' });
    return res.status(200).json(serialize(profile));
  }

  if (method === 'PUT') {
    if (!profile) return res.status(404).json({ message: 'Not found' });
    const updated = { ...profile, ...body, updatedAt: new Date() };
    (sampleProfiles as any)[idx] = updated;
    return res.status(200).json(serialize(updated));
  }

  if (method === 'DELETE') {
    if (!profile) return res.status(404).json({ message: 'Not found' });
    (sampleProfiles as any).splice(idx, 1);
    return res.status(204).end();
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  res.status(405).end('Method Not Allowed');
}
