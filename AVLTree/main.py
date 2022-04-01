import insert
import delete

def main():
    avltree = None
    keyList = None
    while True:
        what = input("# 어느 연산을 수행하실 것인가요? #\n1. insertion / 2. deletion / 3. quit\n>>> ")
        if what == '1':
            fileName = input("# insert 할 파일명을 입력해주세요. #\n>>> ")
            avltree, keyList = insert.insertFile(fileName)
        elif what == '2':
            if avltree is None or keyList is None:
                print("# 우선 insert를 하여 트리를 만들어야합니다. #\n")
            else:
                fileName = input("# delete 할 파일명을 입력해주세요. #\n>>> ")
                deleted_avltree = delete.deleteFile(fileName, avltree, keyList)
        elif what == '3':
            print("# 프로그램이 종료됩니다. #")
            break
        else:
            print("# 잘못된 입력입니다. 다시 입력해주십시오. #\n")

if __name__ == "__main__":
    main()