import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

    const credential = new StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credential
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const imageList = [];

    for await (const blob of containerClient.listBlobsFlat()) {
      const sasToken = generateBlobSASQueryParameters({
        containerName,
        blobName: blob.name,
        permissions: BlobSASPermissions.parse('r'),
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // Expira en 1 hora
      }, credential).toString();
      const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blob.name}?${sasToken}`;
      imageList.push({ name: blob.name, url: blobUrl, sasToken: sasToken });
    }

    res.status(200).json(imageList);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
}
