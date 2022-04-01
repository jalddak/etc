class Node:
    def __init__(self):
        self.kvs = []
        self.childnodes = []
        self.isLeaf = True
        self.isRoot = False

    def sort(self):
        kvs_length = len(self.kvs)
        j = 0
        while j < kvs_length:
            if self.kvs[j].key > self.kvs[kvs_length-1].key:
                save = self.kvs.pop(kvs_length-1)
                self.kvs.insert(j, save)
            j += 1