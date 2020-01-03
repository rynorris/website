package cache

import (
	"crypto/md5"
	"encoding/base64"
	"strings"
	"sync"
)

type EtagCacheEntry struct {
	ETag ETag
	Blob []byte
}

type ETag string
type Key string

// EtagCache calculates,  stores and returns Etags for HTML resources.
type ETagCache interface {
	Put(key Key, blob []byte) ETag
	Get(key Key, etag ETag) ([]byte, bool)
	Invalidate(key Key)
	InvalidatePrefix(keyPrefix string)
}

type md5ETagCache struct {
	cache map[Key]EtagCacheEntry
	lock  sync.RWMutex
}

func NewMD5EtagCache() ETagCache {
	return &md5ETagCache{
		cache: map[Key]EtagCacheEntry{},
		lock:  sync.RWMutex{},
	}
}

func (c *md5ETagCache) Put(key Key, blob []byte) ETag {
	c.lock.Lock()
	defer c.lock.Unlock()

	etag := c.calculateETag(blob)
	c.cache[key] = EtagCacheEntry{ etag, blob }
	return etag
}

func (c *md5ETagCache) Get(key Key, etag ETag) ([]byte, bool) {
	c.lock.RLock()
	defer c.lock.RUnlock()
	stored, ok := c.cache[key]
	if ok && stored.ETag == etag {
		return stored.Blob, true
	} else {
		return nil, false
	}
}

func (c *md5ETagCache) Invalidate(key Key) {
	c.lock.Lock()
	defer c.lock.Unlock()
	delete(c.cache, key)
}

func (c *md5ETagCache) InvalidatePrefix(keyPrefix string) {
	c.lock.Lock()
	defer c.lock.Unlock()

	for key := range(c.cache) {
		if strings.HasPrefix(string(key), keyPrefix) {
			delete(c.cache, key)
		}
	}
}

func (c *md5ETagCache) calculateETag(blob []byte) ETag {
	md5sum := md5.Sum(blob)
	return ETag(base64.StdEncoding.EncodeToString(md5sum[:]))
}
