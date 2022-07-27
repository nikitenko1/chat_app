import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { postDataAPI } from './../../utils/fetchData';
import HeadInfo from './../../utils/HeadInfo';

const ActivateAccount = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const activateUserAccount = useCallback(async () => {
    try {
      const res = await postDataAPI('auth/activate', { token: id });
      dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });
      navigate('/');
    } catch (err) {
      dispatch({
        type: 'alert/alert',
        payload: { errors: err.response.data.msg },
      });
      navigate('/');
    }
  }, [id, dispatch, navigate]);

  useEffect(() => {
    activateUserAccount();
  }, [activateUserAccount]);

  return (
    <>
      <HeadInfo title="Inspace - Account Activation" />
      <div></div>
    </>
  );
};

export default ActivateAccount;
