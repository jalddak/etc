class AVLTree:
    def __init__(self, root=None):
        self.root = root

    # search
    def search(self, root, key):
        node = None
        if root is None:
            node = None
        elif root.key > key:
            node = self.search(root.left, key)
        elif root.key < key:
            node = self.search(root.right, key)
        elif root.key == key:
            node = root
        return node

    # insert
    def insert(self, root, node):
        if root is None:
            root = node
        elif root.key > node.key:
            root.left = self.insert(root.left, node)
        elif root.key < node.key:
            root.right = self.insert(root.right, node)

        root.height = max(self.height(root.left), self.height(root.right)) + 1

        bf = self.height(root.left) - self.height(root.right)
        if abs(bf) > 1:
            root = self.rebalance(root, bf)
        return root

    # 자식 노드 높이
    def height(self, node):
        height = node.height if node is not None else 0
        return height

    # AVL 규칙 맞추기
    def rebalance(self, node, bf):
        if bf == 2:
            midnode = node.left
            # LL case
            if self.height(midnode.left) >= self.height(midnode.right):
                node = self.rightRotate(node)
            #LR case
            else:
                node.left = self.leftRotate(midnode)
                node = self.rightRotate(node)
        elif bf == -2:
            midnode = node.right
            # RR case
            if self.height(midnode.left) <= self.height(midnode.right):
                node = self.leftRotate(node)
            #RL case
            else:
                node.right = self.rightRotate(midnode)
                node = self.leftRotate(node)
        return node


    # 오른쪽 회전
    def rightRotate(self, node):
        midnode = node.left
        node.left = midnode.right
        midnode.right = node
        node.height = max(self.height(node.left), self.height(node.right)) + 1
        midnode.height = max(self.height(midnode.left), self.height(midnode.right)) + 1
        return midnode

    # 왼쪽 회전
    def leftRotate(self, node):
        midnode = node.right
        node.right = midnode.left
        midnode.left = node
        node.height = max(self.height(node.left), self.height(node.right)) + 1
        midnode.height = max(self.height(midnode.left), self.height(midnode.right)) + 1
        return midnode

    # delete
    def delete(self, root, key):
        if root is None:
            return root
        elif root.key > key:
            root.left = self.delete(root.left, key)
        elif root.key < key:
            root.right = self.delete(root.right, key)
        elif root.key == key:
            if root.left is None and root.right is None:
                root = None
                return root
            elif root.left is not None and root.right is None:
                root = root.left
            elif root.left is None and root.right is not None:
                root = root.right
            elif root.left is not None and root.right is not None:
                changenode = root.left
                depth = 0
                while changenode.right is not None:
                    changenode = changenode.right
                    depth += 1

                tmpleft = changenode.left

                changenode.right = root.right
                num = 0
                changenode.left = self.two_childnode(root.left, depth, num, tmpleft)

                changenode.height = max(self.height(changenode.left), self.height(changenode.right)) + 1

                bf = self.height(changenode.left) - self.height(changenode.right)
                if abs(bf) > 1:
                    changenode = self.rebalance(changenode, bf)

                return changenode

        root.height = max(self.height(root.left), self.height(root.right)) + 1

        bf = self.height(root.left) - self.height(root.right)
        if abs(bf) > 1:
            root = self.rebalance(root, bf)
        return root

    # 삭제하려는 노드의 차일드 노드가 2개 일 경우
    def two_childnode(self, root, depth, num, changenode_left):
        if num < depth:
            num += 1
            root.right = self.two_childnode(root.right, depth, num, changenode_left)
        else:
            return changenode_left

        root.height = max(self.height(root.left), self.height(root.right)) + 1

        bf = self.height(root.left) - self.height(root.right)
        if abs(bf) > 1:
            root = self.rebalance(root, bf)
        return root