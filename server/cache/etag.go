package cache

import (
	"crypto/md5"
	"encoding/base64"
	"sync"
)

type ETag string
type Key string

// EtagCache calculates,  stores and returns Etags for HTML resources.
type ETagCache interface {
	Put(key Key, blob []byte) ETag
	Matches(key Key, etag ETag) bool
	Invalidate(key Key)
}

type md5ETagCache struct {
	cache map[Key]ETag
	lock  sync.RWMutex
}

func NewMD5EtagCache() ETagCache {
	return &md5ETagCache{
		cache: map[Key]ETag{},
		lock:  sync.RWMutex{},
	}
}

func (c *md5ETagCache) Put(key Key, blob []byte) ETag {
	c.lock.Lock()
	defer c.lock.Unlock()

	etag := c.calculateETag(blob)
	c.cache[key] = etag
	return etag
}

func (c *md5ETagCache) Matches(key Key, etag ETag) bool {
	c.lock.RLock()
	defer c.lock.RUnlock()
	stored, ok := c.cache[key]
	return ok && stored == etag
}

func (c *md5ETagCache) Invalidate(key Key) {
	c.lock.Lock()
	defer c.lock.Unlock()
	delete(c.cache, key)
}

func (c *md5ETagCache) calculateETag(blob []byte) ETag {
	md5sum := md5.Sum(blob)
	return ETag(base64.StdEncoding.EncodeToString(md5sum[:]))
}
