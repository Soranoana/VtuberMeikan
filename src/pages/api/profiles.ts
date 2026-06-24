import type { NextApiRequest, NextApiResponse } from 'next';
import { sampleProfiles } from '../../app/data/sampleData';

function serialize(profile: any) {
  return {
    ...profile,
    createdAt: profile.createdAt ? new Date(profile.createdAt).toISOString() : null,
    updatedAt: profile.updatedAt ? new Date(profile.updatedAt).toISOString() : null,
  };
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    return res.status(200).json(sampleProfiles.map(serialize));
  }

  if (req.method === 'POST') {
    const payload = req.body;
    const newProfile = { ...payload, id: Date.now().toString(), createdAt: new Date() };
    // Mutate in-memory mock (not persistent across deployments)
    (sampleProfiles as any).unshift(newProfile);
    return res.status(201).json(serialize(newProfile));
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).end('Method Not Allowed');
}
